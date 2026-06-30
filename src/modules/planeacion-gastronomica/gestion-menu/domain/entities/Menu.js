class Menu {
  constructor({
    idMenu, codigo, nombre, idComedor, nombreComedor,
    fechaInicio, fechaFin, estado, fechaCreacion, fechaActualizacion
  }) {
    this.idMenu = idMenu;
    this.codigo = codigo;
    this.nombre = nombre;
    this.idComedor = idComedor;
    this.nombreComedor = nombreComedor;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
  }

  isActive() {
    return this.estado === 'activo';
  }
}

module.exports = Menu;