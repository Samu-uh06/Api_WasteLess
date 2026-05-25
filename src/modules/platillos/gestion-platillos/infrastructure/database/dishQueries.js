const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='CategoriasPlatillo' AND xtype='U')
  CREATE TABLE CategoriasPlatillo (
    idCategoria        INT PRIMARY KEY IDENTITY(1,1),
    nombre             NVARCHAR(100) NOT NULL,
    descripcion        NVARCHAR(300),
    estado             NVARCHAR(20) DEFAULT 'activo',
    fechaCreacion      DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_CategoriasPlatillo_nombre UNIQUE (nombre)
  );

  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Platillos' AND xtype='U')
  CREATE TABLE Platillos (
    idPlatillo         INT PRIMARY KEY IDENTITY(1,1),
    nombre             NVARCHAR(150) NOT NULL,
    descripcion        NVARCHAR(500),
    precio             DECIMAL(10,2) NOT NULL,
    calorias           DECIMAL(10,2),
    proteinas          DECIMAL(10,2),
    carbohidratos      DECIMAL(10,2),
    grasas             DECIMAL(10,2),
    imagen             NVARCHAR(500),
    idCategoria        INT NOT NULL,
    estado             NVARCHAR(20) DEFAULT 'activo',
    fechaCreacion      DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_Platillos_nombre UNIQUE (nombre),
    FOREIGN KEY (idCategoria) REFERENCES CategoriasPlatillo(idCategoria)
  );

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Platillos_nombre')
    CREATE INDEX IDX_Platillos_nombre ON Platillos(nombre);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Platillos_estado')
    CREATE INDEX IDX_Platillos_estado ON Platillos(estado);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Platillos_idCategoria')
    CREATE INDEX IDX_Platillos_idCategoria ON Platillos(idCategoria);
`;

module.exports = { CREATE_TABLES };