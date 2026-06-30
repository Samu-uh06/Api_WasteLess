const Joi = require('joi');

const UpdateDishDTO = Joi.object({
  nombre: Joi.string().max(150).required(),
  descripcion: Joi.string().max(500).optional(),
  precio: Joi.number().positive().required(),
  calorias: Joi.number().min(0).optional(),
  proteinas: Joi.number().min(0).optional(),
  carbohidratos: Joi.number().min(0).optional(),
  grasas: Joi.number().min(0).optional(),
  idCategoria: Joi.number().integer().required(),
  bebida: Joi.boolean().optional().default(false)
});

module.exports = UpdateDishDTO;