const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Menus' AND xtype='U')
  CREATE TABLE Menus (
    idMenu             INT PRIMARY KEY IDENTITY(1,1),
    codigo             NVARCHAR(50) NOT NULL,
    nombre             NVARCHAR(150) NOT NULL,
    idComedor          INT NOT NULL,
    fechaInicio        DATE NOT NULL,
    fechaFin           DATE NOT NULL,
    estado             NVARCHAR(20) DEFAULT 'activo',
    fechaCreacion      DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_Menus_codigo UNIQUE (codigo),
    FOREIGN KEY (idComedor) REFERENCES Comedores(idComedor)
  );

  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MenuDetalle' AND xtype='U')
  CREATE TABLE MenuDetalle (
    idDetalle   INT PRIMARY KEY IDENTITY(1,1),
    idMenu      INT NOT NULL,
    diaSemana   NVARCHAR(20) NOT NULL,
    tipoComida  NVARCHAR(20) NOT NULL,
    idPlatillo  INT NOT NULL,
    FOREIGN KEY (idMenu) REFERENCES Menus(idMenu),
    FOREIGN KEY (idPlatillo) REFERENCES Platillos(idPlatillo)
  );

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Menus_codigo')
    CREATE INDEX IDX_Menus_codigo ON Menus(codigo);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Menus_nombre')
    CREATE INDEX IDX_Menus_nombre ON Menus(nombre);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Menus_idComedor')
    CREATE INDEX IDX_Menus_idComedor ON Menus(idComedor);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_MenuDetalle_idMenu')
    CREATE INDEX IDX_MenuDetalle_idMenu ON MenuDetalle(idMenu);
`;

module.exports = { CREATE_TABLES };