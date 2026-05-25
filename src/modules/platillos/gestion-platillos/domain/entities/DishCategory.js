class DishCategory {
  constructor({ idCategoria, nombre, descripcion, estado, fechaCreacion, fechaActualizacion }) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
  }

  isActive() {
    return this.estado === 'activo';
  }
}

module.exports = DishCategory;