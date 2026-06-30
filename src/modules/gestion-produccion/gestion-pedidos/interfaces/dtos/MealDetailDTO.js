const MealDetailDTO = (detail) => ({
  idDetalle: detail.idDetalle,
  idPedido: detail.idPedido,
  diaSemana: detail.diaSemana,
  tipoComida: detail.tipoComida,
  idPlatillo: detail.idPlatillo,
  nombrePlatillo: detail.nombrePlatillo,
  imagen: detail.imagen,
  estadoProduccion: detail.estadoProduccion,
  observaciones: detail.observaciones,
});

module.exports = MealDetailDTO;