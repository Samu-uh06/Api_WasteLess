const RoleResponseDTO = (role) => ({
  idRol: role.idRol,
  nombre: role.nombre,
  descripcion: role.descripcion,
  estado: role.estado,
  permisos: role.permisos || [],
  totalUsuarios: role.totalUsuarios || 0,
  fechaCreacion: role.fechaCreacion,
  fechaActualizacion: role.fechaActualizacion,
});

module.exports = RoleResponseDTO;