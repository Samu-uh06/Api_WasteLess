const Joi = require('joi');

const UpdateMenuDTO = Joi.object({
  codigo: Joi.string().max(50).required(),
  nombre: Joi.string().max(150).required(),
  idComedor: Joi.number().integer().required(),
  fechaInicio: Joi.date().required(),
  fechaFin: Joi.date().required(),
});

module.exports = UpdateMenuDTO;