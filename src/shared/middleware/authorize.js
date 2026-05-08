const AppException = require('../exceptions/AppException');

const authorize = (...permissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];
    const hasPermission = permissions.every(p => userPermissions.includes(p));

    if (!hasPermission) {
      throw new AppException('Acceso denegado', 403, 'ACCESS_DENIED');
    }
    next();
  };
};

module.exports = authorize;