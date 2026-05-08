const Joi = require('joi');

const CreateUserDTO = Joi.object({
  nombres: Joi.string().max(100).required(),
  apellidos: Joi.string().max(100).required(),
  tipoDocumento: Joi.string().valid('CC', 'CE', 'NIT', 'PASAPORTE').required(),
  numeroDocumento: Joi.string().max(50).required(),
  telefono: Joi.string().max(20).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.pattern.base': 'La contraseña debe tener al menos una mayúscula y un número',
    'string.min': 'La contraseña debe tener mínimo 8 caracteres',
  }),
  empresa: Joi.string().max(150).optional(),
  idRol: Joi.number().integer().required(),
});

module.exports = CreateUserDTO;