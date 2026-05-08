const UserResponseDTO = (user) => ({
  idUsuario: user.idUsuario,
  nombres: user.nombres,
  apellidos: user.apellidos,
  nombreCompleto: user.fullName ? user.fullName() : `${user.nombres} ${user.apellidos}`,
  tipoDocumento: user.tipoDocumento,
  numeroDocumento: user.numeroDocumento,
  telefono: user.telefono,
  email: user.email,
  empresa: user.empresa,
  idRol: user.idRol,
  nombreRol: user.nombreRol,
  estado: user.estado,
  fechaCreacion: user.fechaCreacion,
  fechaActualizacion: user.fechaActualizacion,
});

module.exports = UserResponseDTO;