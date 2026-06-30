class DiningRoom {
  constructor({
    idComedor, nombre, idEmpresa, nombreEmpresa, direccion, capacidad,
    totalEmpleados, encargado, telefono, horario, descripcion,
    estado, fechaCreacion, fechaActualizacion
  }) {
    this.idComedor = idComedor;
    this.nombre = nombre;
    this.idEmpresa = idEmpresa;
    this.nombreEmpresa = nombreEmpresa;
    this.direccion = direccion;
    this.capacidad = capacidad;
    this.totalEmpleados = totalEmpleados;
    this.encargado = encargado;
    this.telefono = telefono;
    this.horario = horario;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
  }

  isActive() {
    return this.estado === 'activo';
  }
}

module.exports = DiningRoom;