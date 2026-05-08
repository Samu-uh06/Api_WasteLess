const Joi = require('joi');

const UpdateUserDTO = Joi.object({
  nombres: Joi.string().max(100).required(),
  apellidos: Joi.string().max(100).required(),
  tipoDocumento: Joi.string().valid('CC', 'CE', 'NIT', 'PASAPORTE').required(),
  numeroDocumento: Joi.string().max(50).required(),
  telefono: Joi.string().max(20).optional(),
  empresa: Joi.string().max(150).optional(),
  idRol: Joi.number().integer().required(),
});

module.exports = UpdateUserDTO;