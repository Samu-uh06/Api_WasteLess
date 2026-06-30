class ProductionOrder {
  constructor(data) {
    this.idOrden            = data.idOrden;
    this.codigo             = data.codigo;
    this.idPedido           = data.idPedido;
    this.diaSemana          = data.diaSemana;
    this.estado             = data.estado;
    this.fechaCreacion      = data.fechaCreacion;
    this.fechaActualizacion = data.fechaActualizacion;
    this.nombreComedor      = data.nombreComedor;
    this.nombreEmpresa      = data.nombreEmpresa;
    this.capacidad          = data.capacidad;
    this.cantPlatillos      = data.cantPlatillos;
    this.fechaDia           = data.fechaDia;
  }
}

module.exports = ProductionOrder;