const DiningRoomResponseDTO = (diningRoom) => ({
  idComedor: diningRoom.idComedor,
  nombre: diningRoom.nombre,
  idEmpresa: diningRoom.idEmpresa,
  nombreEmpresa: diningRoom.nombreEmpresa,
  direccion: diningRoom.direccion,
  capacidad: diningRoom.capacidad,
  totalEmpleados: diningRoom.totalEmpleados,
  encargado: diningRoom.encargado,
  telefono: diningRoom.telefono,
  horario: diningRoom.horario,
  descripcion: diningRoom.descripcion,
  estado: diningRoom.estado,
  fechaCreacion: diningRoom.fechaCreacion,
  fechaActualizacion: diningRoom.fechaActualizacion,
});

module.exports = DiningRoomResponseDTO;