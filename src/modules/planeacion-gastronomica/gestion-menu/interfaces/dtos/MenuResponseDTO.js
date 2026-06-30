const MenuResponseDTO = (menu) => ({
  idMenu: menu.idMenu,
  codigo: menu.codigo,
  nombre: menu.nombre,
  idComedor: menu.idComedor,
  nombreComedor: menu.nombreComedor,
  fechaInicio: menu.fechaInicio,
  fechaFin: menu.fechaFin,
  estado: menu.estado,
  fechaCreacion: menu.fechaCreacion,
  fechaActualizacion: menu.fechaActualizacion,
});

module.exports = MenuResponseDTO;