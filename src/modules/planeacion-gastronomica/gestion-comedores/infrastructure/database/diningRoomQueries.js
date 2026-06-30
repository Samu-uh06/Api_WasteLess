const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Comedores' AND xtype='U')
  CREATE TABLE Comedores (
    idComedor          INT PRIMARY KEY IDENTITY(1,1),
    nombre             NVARCHAR(150) NOT NULL,
    idEmpresa          INT NOT NULL,
    direccion          NVARCHAR(300) NOT NULL,
    capacidad          INT NOT NULL,
    totalEmpleados     INT DEFAULT 0,
    encargado          NVARCHAR(150),
    telefono           NVARCHAR(20),
    horario            NVARCHAR(100),
    descripcion        NVARCHAR(500),
    estado             NVARCHAR(20) DEFAULT 'activo',
    fechaCreacion      DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (idEmpresa) REFERENCES Empresas(idEmpresa)
  );

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Comedores_nombre')
    CREATE INDEX IDX_Comedores_nombre ON Comedores(nombre);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Comedores_idEmpresa')
    CREATE INDEX IDX_Comedores_idEmpresa ON Comedores(idEmpresa);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Comedores_estado')
    CREATE INDEX IDX_Comedores_estado ON Comedores(estado);
`;

module.exports = { CREATE_TABLES };