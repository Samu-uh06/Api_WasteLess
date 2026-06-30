const OrderResponseDTO = (order) => ({
  idPedido: order.idPedido,
  idMenu: order.idMenu,
  idEmpresa: order.idEmpresa,
  idComedor: order.idComedor,
  nombreEmpresa: order.nombreEmpresa,
  nombreComedor: order.nombreComedor,
  nombreMenu: order.nombreMenu,
  semana: order.semana,
  fechaInicio: order.fechaInicio,
  fechaFin: order.fechaFin,
  estado: order.estado,
  fechaCreacion: order.fechaCreacion,
  fechaActualizacion: order.fechaActualizacion,
});

module.exports = OrderResponseDTO;