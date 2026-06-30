const Joi = require('joi');

const UpdateDiningRoomDTO = Joi.object({
  nombre: Joi.string().max(150).required(),
  idEmpresa: Joi.number().integer().required(),
  direccion: Joi.string().max(300).required(),
  capacidad: Joi.number().integer().positive().required(),
  totalEmpleados: Joi.number().integer().min(0).optional(),
  encargado: Joi.string().max(150).optional(),
  telefono: Joi.string().max(20).optional(),
  horario: Joi.string().max(100).optional(),
  descripcion: Joi.string().max(500).optional(),
});

module.exports = UpdateDiningRoomDTO;