class OrderDetail {
  constructor({
    idDetalle, idPedido, diaSemana, tipoComida, idPlatillo,
    estadoProduccion, observaciones, nombrePlatillo, imagen
  }) {
    this.idDetalle = idDetalle;
    this.idPedido = idPedido;
    this.diaSemana = diaSemana;
    this.tipoComida = tipoComida;
    this.idPlatillo = idPlatillo;
    this.estadoProduccion = estadoProduccion;
    this.observaciones = observaciones;
    this.nombrePlatillo = nombrePlatillo;
    this.imagen = imagen;
  }

  isPending() {
    return this.estadoProduccion === 'pendiente';
  }

  isInProgress() {
    return this.estadoProduccion === 'en_proceso';
  }

  isCompleted() {
    return this.estadoProduccion === 'completado';
  }
}

module.exports = OrderDetail;