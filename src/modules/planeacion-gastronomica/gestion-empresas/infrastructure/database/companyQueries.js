const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Ciudades' AND xtype='U')
  CREATE TABLE Ciudades (
    idCiudad      INT PRIMARY KEY IDENTITY(1,1),
    nombre        NVARCHAR(100) NOT NULL,
    departamento  NVARCHAR(100) NOT NULL,
    CONSTRAINT UQ_Ciudades_nombre UNIQUE (nombre)
  );

  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Empresas' AND xtype='U')
  CREATE TABLE Empresas (
    idEmpresa          INT PRIMARY KEY IDENTITY(1,1),
    nombreEmpresa      NVARCHAR(200) NOT NULL,
    tipoEmpresa        NVARCHAR(20) NOT NULL,
    nit                NVARCHAR(50) NOT NULL,
    idCiudad           INT NOT NULL,
    direccion          NVARCHAR(300),
    nombreContacto     NVARCHAR(150),
    emailContacto      NVARCHAR(150),
    telefonoContacto   NVARCHAR(20),
    estado             NVARCHAR(20) DEFAULT 'activo',
    fechaRegistro      DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_Empresas_nit UNIQUE (nit),
    FOREIGN KEY (idCiudad) REFERENCES Ciudades(idCiudad)
  );

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Empresas_nombreEmpresa')
    CREATE INDEX IDX_Empresas_nombreEmpresa ON Empresas(nombreEmpresa);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Empresas_nit')
    CREATE INDEX IDX_Empresas_nit ON Empresas(nit);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Empresas_idCiudad')
    CREATE INDEX IDX_Empresas_idCiudad ON Empresas(idCiudad);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Empresas_estado')
    CREATE INDEX IDX_Empresas_estado ON Empresas(estado);
`;

const SEED_CITIES = `
  IF NOT EXISTS (SELECT * FROM Ciudades)
  BEGIN
    INSERT INTO Ciudades (nombre, departamento) VALUES
      ('Medellín', 'Antioquia'),
      ('Bogotá', 'Cundinamarca'),
      ('Cali', 'Valle del Cauca'),
      ('Barranquilla', 'Atlántico'),
      ('Cartagena', 'Bolívar'),
      ('Bucaramanga', 'Santander'),
      ('Pereira', 'Risaralda'),
      ('Manizales', 'Caldas'),
      ('Santa Marta', 'Magdalena'),
      ('Cúcuta', 'Norte de Santander'),
      ('Ibagué', 'Tolima'),
      ('Villavicencio', 'Meta'),
      ('Montería', 'Córdoba'),
      ('Pasto', 'Nariño'),
      ('Armenia', 'Quindío')
  END
`;

module.exports = { CREATE_TABLES, SEED_CITIES };