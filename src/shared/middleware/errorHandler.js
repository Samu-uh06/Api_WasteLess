const logger = require('../utils/logger');
const AppException = require('../exceptions/AppException');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppException) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }

  if (err.message?.includes('UQ_Usuarios_email')) {
    return res.status(400).json({
      success: false,
      code: 'DUPLICATE_EMAIL',
      message: 'El correo electrónico ya está registrado',
    });
  }

  if (err.message?.includes('UQ_Usuarios_documento')) {
    return res.status(400).json({
      success: false,
      code: 'DUPLICATE_DOCUMENT',
      message: 'El número de documento ya está registrado',
    });
  }

  if (err.message?.includes('UQ_Platillos_nombre')) {
    return res.status(400).json({
      success: false,
      code: 'DUPLICATE_DISH',
      message: 'Ya existe un platillo con ese nombre',
    });
  }

    if (err.message?.includes('UQ_Menus_codigo')) {
    return res.status(400).json({
      success: false,
      code: 'DUPLICATE_MENU_CODE',
      message: 'Ya existe un menú con ese código',
    });
  }

  return res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'Error interno del servidor',
  });
};

module.exports = errorHandler;