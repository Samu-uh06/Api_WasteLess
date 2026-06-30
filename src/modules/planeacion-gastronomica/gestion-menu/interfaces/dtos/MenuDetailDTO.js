const Joi = require('joi');

const MenuDetailDTO = Joi.object({
  diaSemana: Joi.string().valid('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado').required(),
  tipoComida: Joi.string().valid('Desayuno', 'Almuerzo', 'Media tarde').required(),
  idPlatillo: Joi.number().integer().required(),
});

module.exports = MenuDetailDTO;