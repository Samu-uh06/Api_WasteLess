const Joi = require('joi');

const LoginDTO = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'El usuario es obligatorio',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'La contraseña es obligatoria',
  }),
});

module.exports = LoginDTO;