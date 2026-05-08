const CREATE_TABLE = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
  CREATE TABLE Usuarios (
    idUsuario         INT PRIMARY KEY IDENTITY(1,1),
    nombres           NVARCHAR(100) NOT NULL,
    apellidos         NVARCHAR(100) NOT NULL,
    tipoDocumento     NVARCHAR(20) NOT NULL,
    numeroDocumento   NVARCHAR(50) NOT NULL,
    telefono          NVARCHAR(20),
    email             NVARCHAR(150) NOT NULL,
    password          NVARCHAR(500) NOT NULL,
    empresa           NVARCHAR(150),
    idRol             INT NOT NULL,
    estado            NVARCHAR(20) DEFAULT 'activo',
    fechaCreacion     DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_Usuarios_email UNIQUE (email),
    CONSTRAINT UQ_Usuarios_documento UNIQUE (numeroDocumento),
    FOREIGN KEY (idRol) REFERENCES Roles(idRol)
  );

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Usuarios_email')
    CREATE INDEX IDX_Usuarios_email ON Usuarios(email);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Usuarios_documento')
    CREATE INDEX IDX_Usuarios_documento ON Usuarios(numeroDocumento);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Usuarios_estado')
    CREATE INDEX IDX_Usuarios_estado ON Usuarios(estado);
`;

module.exports = { CREATE_TABLE };