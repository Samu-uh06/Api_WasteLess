class Company {
  constructor({
    idEmpresa, nombreEmpresa, tipoEmpresa, nit, idCiudad, nombreCiudad,
    departamento, direccion, nombreContacto, emailContacto, telefonoContacto,
    estado, fechaRegistro, fechaActualizacion
  }) {
    this.idEmpresa = idEmpresa;
    this.nombreEmpresa = nombreEmpresa;
    this.tipoEmpresa = tipoEmpresa;
    this.nit = nit;
    this.idCiudad = idCiudad;
    this.nombreCiudad = nombreCiudad;
    this.departamento = departamento;
    this.direccion = direccion;
    this.nombreContacto = nombreContacto;
    this.emailContacto = emailContacto;
    this.telefonoContacto = telefonoContacto;
    this.estado = estado;
    this.fechaRegistro = fechaRegistro;
    this.fechaActualizacion = fechaActualizacion;
  }

  isActive() {
    return this.estado === 'activo';
  }
}

module.exports = Company;