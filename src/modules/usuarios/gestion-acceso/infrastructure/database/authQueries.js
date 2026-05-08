const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Sesiones' AND xtype='U')
  CREATE TABLE Sesiones (
    idSesion        UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    idUsuario       INT NOT NULL,
    token           NVARCHAR(MAX) NOT NULL,
    refreshToken    NVARCHAR(500) NOT NULL,
    fechaInicio     DATETIME DEFAULT GETDATE(),
    fechaExpiracion DATETIME NOT NULL,
    ip              NVARCHAR(50),
    dispositivo     NVARCHAR(200),
    estado          NVARCHAR(20) DEFAULT 'activa',
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario)
  );

  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RecuperacionPassword' AND xtype='U')
  CREATE TABLE RecuperacionPassword (
    idRecuperacion  INT PRIMARY KEY IDENTITY(1,1),
    idUsuario       INT NOT NULL,
    token           NVARCHAR(500) NOT NULL UNIQUE,
    fechaExpiracion DATETIME NOT NULL,
    usado           BIT DEFAULT 0,
    fechaCreacion   DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario)
  );
`;

module.exports = { CREATE_TABLES };