const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Pedidos' AND xtype='U')
  CREATE TABLE Pedidos (
    idPedido            INT PRIMARY KEY IDENTITY(1,1),
    idMenu              INT NOT NULL,
    idEmpresa           INT NOT NULL,
    idComedor           INT NOT NULL,
    semana              NVARCHAR(50) NOT NULL,
    fechaInicio         DATE NOT NULL,
    fechaFin            DATE NOT NULL,
    estado              NVARCHAR(20) DEFAULT 'pendiente',
    fechaCreacion       DATETIME DEFAULT GETDATE(),
    fechaActualizacion  DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (idMenu) REFERENCES Menus(idMenu),
    FOREIGN KEY (idEmpresa) REFERENCES Empresas(idEmpresa),
    FOREIGN KEY (idComedor) REFERENCES Comedores(idComedor)
  );

  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PedidoDetalle' AND xtype='U')
  CREATE TABLE PedidoDetalle (
    idDetalle           INT PRIMARY KEY IDENTITY(1,1),
    idPedido            INT NOT NULL,
    diaSemana           NVARCHAR(20) NOT NULL,
    tipoComida          NVARCHAR(20) NOT NULL,
    idPlatillo          INT NOT NULL,
    estadoProduccion    NVARCHAR(20) DEFAULT 'pendiente',
    observaciones       NVARCHAR(500),
    FOREIGN KEY (idPedido) REFERENCES Pedidos(idPedido),
    FOREIGN KEY (idPlatillo) REFERENCES Platillos(idPlatillo)
  );

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Pedidos_idEmpresa')
    CREATE INDEX IDX_Pedidos_idEmpresa ON Pedidos(idEmpresa);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Pedidos_idComedor')
    CREATE INDEX IDX_Pedidos_idComedor ON Pedidos(idComedor);

  IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name='IDX_Pedidos_semana')
    CREATE INDEX IDX_Pedidos_semana ON Pedidos(semana);
`;

module.exports = { CREATE_TABLES };