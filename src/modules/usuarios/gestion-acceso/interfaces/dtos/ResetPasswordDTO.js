const Joi = require('joi');

const ResetPasswordDTO = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*\d)/).required().messages({
    'string.pattern.base': 'La contraseña debe tener al menos una mayúscula y un número',
    'string.min': 'La contraseña debe tener mínimo 8 caracteres',
  }),
});

module.exports = ResetPasswordDTO;