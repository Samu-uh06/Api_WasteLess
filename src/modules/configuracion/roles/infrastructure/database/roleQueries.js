const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Roles' AND xtype='U')
  CREATE TABLE Roles (
    idRol              INT PRIMARY KEY IDENTITY(1,1),
    nombre             NVARCHAR(100) NOT NULL,
    descripcion        NVARCHAR(300),
    estado             NVARCHAR(20) DEFAULT 'activo',
    fechaCreacion      DATETIME DEFAULT GETDATE(),
    fechaActualizacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT UQ_Roles_nombre UNIQUE (nombre)
  );

  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Permisos' AND xtype='U')
  CREATE TABLE Permisos (
    idPermiso    INT PRIMARY KEY IDENTITY(1,1),
    nombre       NVARCHAR(100) NOT NULL,
    codigo       NVARCHAR(100) NOT NULL,
    descripcion  NVARCHAR(300),
    CONSTRAINT UQ_Permisos_codigo UNIQUE (codigo)
  );

  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RolPermiso' AND xtype='U')
  CREATE TABLE RolPermiso (
    idRol     INT NOT NULL,
    idPermiso INT NOT NULL,
    PRIMARY KEY (idRol, idPermiso),
    FOREIGN KEY (idRol) REFERENCES Roles(idRol),
    FOREIGN KEY (idPermiso) REFERENCES Permisos(idPermiso)
  );

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Roles_nombre')
    CREATE INDEX IDX_Roles_nombre ON Roles(nombre);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Roles_estado')
    CREATE INDEX IDX_Roles_estado ON Roles(estado);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Permisos_codigo')
    CREATE INDEX IDX_Permisos_codigo ON Permisos(codigo);
`;

const SEED_PERMISSIONS = `
  IF NOT EXISTS (SELECT * FROM Permisos)
  BEGIN
    INSERT INTO Permisos (nombre, codigo, descripcion) VALUES
      ('Ver roles',      'roles.view',   'Permite ver el listado y detalle de roles'),
      ('Crear roles',    'roles.create', 'Permite crear nuevos roles'),
      ('Editar roles',   'roles.edit',   'Permite editar roles existentes'),
      ('Eliminar roles', 'roles.delete', 'Permite eliminar roles'),
      ('Ver usuarios',      'users.view',   'Permite ver el listado y detalle de usuarios'),
      ('Crear usuarios',    'users.create', 'Permite crear nuevos usuarios'),
      ('Editar usuarios',   'users.edit',   'Permite editar usuarios existentes'),
      ('Eliminar usuarios', 'users.delete', 'Permite eliminar usuarios')
  END
`;

module.exports = { CREATE_TABLES, SEED_PERMISSIONS };