class Auth {
  constructor({ idUsuario, email, password, estado, idRol, permisos }) {
    this.idUsuario = idUsuario;
    this.email = email;
    this.password = password;
    this.estado = estado;
    this.idRol = idRol;
    this.permisos = permisos || [];
  }

  isActive() {
    return this.estado === 'activo';
  }
}

module.exports = Auth;