class Session {
  constructor({ idSesion, idUsuario, token, refreshToken, fechaInicio, fechaExpiracion, ip, dispositivo, estado }) {
    this.idSesion = idSesion;
    this.idUsuario = idUsuario;
    this.token = token;
    this.refreshToken = refreshToken;
    this.fechaInicio = fechaInicio;
    this.fechaExpiracion = fechaExpiracion;
    this.ip = ip;
    this.dispositivo = dispositivo;
    this.estado = estado;
  }

  isActive() {
    return this.estado === 'activa' && new Date() < new Date(this.fechaExpiracion);
  }
}

module.exports = Session;