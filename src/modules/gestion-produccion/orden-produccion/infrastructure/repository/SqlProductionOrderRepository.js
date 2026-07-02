const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const ProductionOrder = require('../../domain/entities/ProductionOrder');

class SqlProductionOrderRepository {

  async getMealsByDay(idPedido, diaSemana) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idPedido',   sql.Int,          parseInt(idPedido))
      .input('diaSemana',  sql.NVarChar(20),  diaSemana)
      .query(`
        SELECT estadoProduccion
        FROM PedidoDetalle
        WHERE idPedido = @idPedido AND diaSemana = @diaSemana
      `);
    return result.recordset;
  }

  async findByPedidoAndDay(idPedido, diaSemana) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idPedido',  sql.Int,         parseInt(idPedido))
      .input('diaSemana', sql.NVarChar(20), diaSemana)
      .query(`
        SELECT * FROM OrdenesProduccion
        WHERE idPedido = @idPedido AND diaSemana = @diaSemana
      `);
    return result.recordset[0] || null;
  }

  async generateCodigo() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT 'OP-' + RIGHT('0000' + CAST(
        ISNULL(MAX(CAST(SUBSTRING(codigo, 4, 10) AS INT)), 0) + 1
      AS VARCHAR), 4) AS codigo
      FROM OrdenesProduccion
    `);
    return result.recordset[0].codigo;
  }

  async create({ idPedido, diaSemana, codigo }) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('codigo',    sql.NVarChar(20),  codigo)
      .input('idPedido',  sql.Int,           parseInt(idPedido))
      .input('diaSemana', sql.NVarChar(20),  diaSemana)
      .query(`
        INSERT INTO OrdenesProduccion (codigo, idPedido, diaSemana)
        OUTPUT INSERTED.*
        VALUES (@codigo, @idPedido, @diaSemana)
      `);
    return new ProductionOrder(result.recordset[0]);
  }

  async findAll() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        op.idOrden,
        op.codigo,
        op.idPedido,
        op.diaSemana,
        op.estado,
        op.fechaCreacion,
        op.fechaActualizacion,
        c.nombre          AS nombreComedor,
        e.nombreEmpresa   AS nombreEmpresa,
        c.capacidad       AS capacidad,
        COUNT(pd.idDetalle) AS cantPlatillos,
        CASE op.diaSemana
          WHEN 'Lunes'     THEN DATEADD(day, 0, p.fechaInicio)
          WHEN 'Martes'    THEN DATEADD(day, 1, p.fechaInicio)
          WHEN 'Miércoles' THEN DATEADD(day, 2, p.fechaInicio)
          WHEN 'Jueves'    THEN DATEADD(day, 3, p.fechaInicio)
          WHEN 'Viernes'   THEN DATEADD(day, 4, p.fechaInicio)
          WHEN 'Sábado'    THEN DATEADD(day, 5, p.fechaInicio)
          ELSE p.fechaInicio
        END AS fechaDia
      FROM OrdenesProduccion op
      INNER JOIN Pedidos    p  ON op.idPedido  = p.idPedido
      INNER JOIN Comedores  c  ON p.idComedor  = c.idComedor
      INNER JOIN Empresas   e  ON p.idEmpresa  = e.idEmpresa
      LEFT  JOIN PedidoDetalle pd ON pd.idPedido = op.idPedido AND pd.diaSemana = op.diaSemana
      GROUP BY
        op.idOrden, op.codigo, op.idPedido, op.diaSemana, op.estado,
        op.fechaCreacion, op.fechaActualizacion,
        c.nombre, e.nombreEmpresa, c.capacidad, p.fechaInicio
      ORDER BY op.idOrden DESC
    `);
    return result.recordset.map(r => new ProductionOrder(r));
  }

  async getTodayOrders() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        op.idOrden, op.codigo, op.diaSemana, op.estado, op.fechaCreacion,
        c.nombre AS nombreComedor, e.nombreEmpresa,
        COUNT(pd.idDetalle) AS cantPlatillos
      FROM OrdenesProduccion op
      INNER JOIN Pedidos p ON op.idPedido = p.idPedido
      INNER JOIN Comedores c ON p.idComedor = c.idComedor
      INNER JOIN Empresas e ON p.idEmpresa = e.idEmpresa
      LEFT JOIN PedidoDetalle pd ON pd.idPedido = op.idPedido AND pd.diaSemana = op.diaSemana
      WHERE CAST(op.fechaCreacion AS DATE) = CAST(GETDATE() AS DATE)
      GROUP BY op.idOrden, op.codigo, op.diaSemana, op.estado, op.fechaCreacion, c.nombre, e.nombreEmpresa
      ORDER BY op.fechaCreacion DESC
    `);
    return result.recordset;
  }
}

module.exports = SqlProductionOrderRepository;