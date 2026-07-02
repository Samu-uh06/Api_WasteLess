class Auth {
  constructor({ idUsuario, email, password, estado, idRol, permisos, nombreRol }) {
    this.idUsuario = idUsuario;
    this.email = email;
    this.password = password;
    this.estado = estado;
    this.idRol = idRol;
    this.nombreRol = nombreRol || null;
    this.permisos = permisos || [];
  }

  isActive() {
    return this.estado === 'activo';
  }
}

module.exports = Auth;