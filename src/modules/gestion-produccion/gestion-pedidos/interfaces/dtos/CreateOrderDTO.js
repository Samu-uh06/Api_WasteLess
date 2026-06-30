const Joi = require('joi');

const CreateOrderDTO = Joi.object({
  idMenu: Joi.number().integer().required(),
  idEmpresa: Joi.number().integer().required(),
  idComedor: Joi.number().integer().required(),
  semana: Joi.string().max(50).required(),
  fechaInicio: Joi.date().required(),
  fechaFin: Joi.date().required(),
});

module.exports = CreateOrderDTO;