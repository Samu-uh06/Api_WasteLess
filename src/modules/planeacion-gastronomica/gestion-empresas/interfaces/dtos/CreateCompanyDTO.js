const Joi = require('joi');

const CreateCompanyDTO = Joi.object({
  nombreEmpresa: Joi.string().max(200).required(),
  tipoEmpresa: Joi.string().valid('Jurídica', 'Natural').required(),
  nit: Joi.string().max(50).required(),
  idCiudad: Joi.number().integer().required(),
  direccion: Joi.string().max(300).optional(),
  nombreContacto: Joi.string().max(150).optional(),
  emailContacto: Joi.string().email().optional(),
  telefonoContacto: Joi.string().max(20).optional(),
});

module.exports = CreateCompanyDTO;