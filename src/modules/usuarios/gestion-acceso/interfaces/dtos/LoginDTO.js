const Joi = require('joi');

const LoginDTO = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'El email no tiene un formato válido',
    'any.required': 'El email es obligatorio',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'La contraseña es obligatoria',
  }),
});

module.exports = LoginDTO;