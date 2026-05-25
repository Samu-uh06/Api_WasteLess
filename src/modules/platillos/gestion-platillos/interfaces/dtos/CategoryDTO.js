const Joi = require('joi');

const CategoryDTO = Joi.object({
  nombre: Joi.string().max(100).required(),
  descripcion: Joi.string().max(300).optional(),
});

module.exports = CategoryDTO;