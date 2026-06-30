const CREATE_TABLES = `
  IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OrdenesProduccion' AND xtype='U')
  CREATE TABLE OrdenesProduccion (
    idOrden            INT IDENTITY(1,1) PRIMARY KEY,
    codigo             NVARCHAR(20)  NOT NULL,
    idPedido           INT           NOT NULL,
    diaSemana          NVARCHAR(20)  NOT NULL,
    estado             NVARCHAR(20)  NOT NULL DEFAULT 'pendiente',
    fechaCreacion      DATETIME               DEFAULT GETDATE(),
    fechaActualizacion DATETIME               DEFAULT GETDATE(),
    CONSTRAINT FK_OrdenesProduccion_Pedidos FOREIGN KEY (idPedido) REFERENCES Pedidos(idPedido),
    CONSTRAINT UQ_OrdenProduccion_PedidoDia UNIQUE (idPedido, diaSemana)
  );
`;

const SEED_PERMISSIONS = `
  IF NOT EXISTS (SELECT 1 FROM Permisos WHERE codigo = 'production-orders.view')
    INSERT INTO Permisos (nombre, codigo, descripcion) VALUES
      ('Ver órdenes de producción', 'production-orders.view', 'Permite ver el listado de órdenes de producción');

  IF NOT EXISTS (SELECT 1 FROM Permisos WHERE codigo = 'production-orders.create')
    INSERT INTO Permisos (nombre, codigo, descripcion) VALUES
      ('Crear órdenes de producción', 'production-orders.create', 'Permite pasar pedidos completados a producción');
`;

module.exports = { CREATE_TABLES, SEED_PERMISSIONS };