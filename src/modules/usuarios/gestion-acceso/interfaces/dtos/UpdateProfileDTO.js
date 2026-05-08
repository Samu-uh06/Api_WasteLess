const Joi = require('joi');

const UpdateProfileDTO = Joi.object({
  nombres: Joi.string().max(100).required(),
  apellidos: Joi.string().max(100).required(),
  telefono: Joi.string().max(20).optional(),
  newPassword: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*\d)/).optional(),
});

module.exports = UpdateProfileDTO;