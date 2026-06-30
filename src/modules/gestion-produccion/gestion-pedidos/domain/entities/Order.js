class Order {
  constructor({
    idPedido, idMenu, idEmpresa, idComedor, semana,
    fechaInicio, fechaFin, estado, fechaCreacion, fechaActualizacion,
    nombreEmpresa, nombreComedor, nombreMenu
  }) {
    this.idPedido = idPedido;
    this.idMenu = idMenu;
    this.idEmpresa = idEmpresa;
    this.idComedor = idComedor;
    this.semana = semana;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
    this.nombreEmpresa = nombreEmpresa;
    this.nombreComedor = nombreComedor;
    this.nombreMenu = nombreMenu;
  }

  isPending() {
    return this.estado === 'pendiente';
  }

  isInProgress() {
    return this.estado === 'en_proceso';
  }

  isCompleted() {
    return this.estado === 'completado';
  }
}

module.exports = Order;