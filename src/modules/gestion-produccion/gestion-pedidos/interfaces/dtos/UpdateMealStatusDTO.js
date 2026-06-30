const Joi = require('joi');

const UpdateMealStatusDTO = Joi.object({
  estadoProduccion: Joi.string().valid('pendiente', 'en_proceso', 'completado').required(),
});

module.exports = UpdateMealStatusDTO;