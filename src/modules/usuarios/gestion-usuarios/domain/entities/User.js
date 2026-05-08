class User {
  constructor({
    idUsuario, nombres, apellidos, tipoDocumento, numeroDocumento,
    telefono, email, password, empresa, idRol, estado,
    fechaCreacion, fechaActualizacion
  }) {
    this.idUsuario = idUsuario;
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.tipoDocumento = tipoDocumento;
    this.numeroDocumento = numeroDocumento;
    this.telefono = telefono;
    this.email = email;
    this.password = password;
    this.empresa = empresa;
    this.idRol = idRol;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
  }

  isActive() {
    return this.estado === 'activo';
  }

  fullName() {
    return `${this.nombres} ${this.apellidos}`;
  }
}

module.exports = User;