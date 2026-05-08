class Permission {
  constructor({ idPermiso, nombre, codigo, descripcion }) {
    this.idPermiso = idPermiso;
    this.nombre = nombre;
    this.codigo = codigo;
    this.descripcion = descripcion;
  }
}

module.exports = Permission;