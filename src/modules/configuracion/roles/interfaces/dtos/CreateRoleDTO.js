const Joi = require('joi');

const CreateRoleDTO = Joi.object({
  nombre: Joi.string().max(100).required().messages({
    'any.required': 'El nombre del rol es obligatorio',
    'string.max': 'El nombre no puede superar los 100 caracteres',
  }),
  descripcion: Joi.string().max(300).optional(),
  permisos: Joi.array().items(Joi.number().integer()).optional(),
});

module.exports = CreateRoleDTO;