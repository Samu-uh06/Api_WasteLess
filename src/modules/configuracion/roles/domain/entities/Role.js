class Role {
  constructor({ idRol, nombre, descripcion, estado, fechaCreacion, fechaActualizacion }) {
    this.idRol = idRol;
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

module.exports = Role;