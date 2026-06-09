const CompanyResponseDTO = (company) => ({
  idEmpresa: company.idEmpresa,
  nombreEmpresa: company.nombreEmpresa,
  tipoEmpresa: company.tipoEmpresa,
  nit: company.nit,
  idCiudad: company.idCiudad,
  nombreCiudad: company.nombreCiudad,
  departamento: company.departamento,
  direccion: company.direccion,
  contacto: {
    nombre: company.nombreContacto,
    email: company.emailContacto,
    telefono: company.telefonoContacto,
  },
  estado: company.estado,
  fechaRegistro: company.fechaRegistro,
  fechaActualizacion: company.fechaActualizacion,
});

module.exports = CompanyResponseDTO;