const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const OrderRepository = require('../../domain/interfaces/OrderRepository');
const Order = require('../../domain/entities/Order');
const OrderDetail = require('../../domain/entities/OrderDetail');

class SqlOrderRepository extends OrderRepository {
async getCompanies() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT e.idEmpresa, e.nombreEmpresa AS nombre, COUNT(DISTINCT p.idComedor) AS totalComedores
    FROM Empresas e
    INNER JOIN Pedidos p ON p.idEmpresa = e.idEmpresa
    WHERE e.estado != 'eliminado'
    GROUP BY e.idEmpresa, e.nombreEmpresa
    ORDER BY e.nombreEmpresa ASC
  `);
  return result.recordset;
}

  async getDiningRoomsByCompany(idEmpresa) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idEmpresa', sql.Int, parseInt(idEmpresa))
      .query(`
        SELECT c.idComedor, c.nombre, COUNT(DISTINCT p.semana) AS totalSemanas
        FROM Comedores c
        INNER JOIN Pedidos p ON p.idComedor = c.idComedor
        WHERE p.idEmpresa = @idEmpresa AND c.estado != 'eliminado'
        GROUP BY c.idComedor, c.nombre
        ORDER BY c.nombre ASC
      `);
    return result.recordset;
  }

  async getWeeksByDiningRoom(idComedor) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idComedor', sql.Int, parseInt(idComedor))
      .query(`
        SELECT idPedido, semana, fechaInicio, fechaFin, estado
        FROM Pedidos
        WHERE idComedor = @idComedor AND estado != 'eliminado'
        ORDER BY fechaInicio DESC
      `);
    return result.recordset;
  }

  async getOrderById(idPedido) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idPedido', sql.Int, parseInt(idPedido))
      .query(`
        SELECT p.*, e.nombreEmpresa AS nombreEmpresa, c.nombre AS nombreComedor, m.nombre AS nombreMenu
        FROM Pedidos p
        LEFT JOIN Empresas e ON p.idEmpresa = e.idEmpresa
        LEFT JOIN Comedores c ON p.idComedor = c.idComedor
        LEFT JOIN Menus m ON p.idMenu = m.idMenu
        WHERE p.idPedido = @idPedido AND p.estado != 'eliminado'
      `);
    return result.recordset[0] ? new Order(result.recordset[0]) : null;
  }

  async getOrderDetail(idPedido) {
    return this.getOrderById(idPedido);
  }

  async getWeeklyPlanning(idPedido) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idPedido', sql.Int, parseInt(idPedido))
      .query(`
        SELECT pd.*, pl.nombre AS nombrePlatillo, pl.imagen
        FROM PedidoDetalle pd
        LEFT JOIN Platillos pl ON pd.idPlatillo = pl.idPlatillo
        WHERE pd.idPedido = @idPedido
        ORDER BY pd.diaSemana, pd.tipoComida
      `);
    return result.recordset.map(r => new OrderDetail(r));
  }

  async getMealsByDay(idPedido, diaSemana) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idPedido', sql.Int, parseInt(idPedido))
      .input('diaSemana', sql.NVarChar(20), diaSemana)
      .query(`
        SELECT pd.*, pl.nombre AS nombrePlatillo, pl.imagen
        FROM PedidoDetalle pd
        LEFT JOIN Platillos pl ON pd.idPlatillo = pl.idPlatillo
        WHERE pd.idPedido = @idPedido AND pd.diaSemana = @diaSemana
        ORDER BY pd.tipoComida
      `);
    return result.recordset.map(r => new OrderDetail(r));
  }

  async getOrderDetailById(idDetalle) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idDetalle', sql.Int, parseInt(idDetalle))
      .query(`
        SELECT pd.*, pl.nombre AS nombrePlatillo, pl.imagen
        FROM PedidoDetalle pd
        LEFT JOIN Platillos pl ON pd.idPlatillo = pl.idPlatillo
        WHERE pd.idDetalle = @idDetalle
      `);
    return result.recordset[0] ? new OrderDetail(result.recordset[0]) : null;
  }

  async updateMealStatus(idDetalle, estadoProduccion) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idDetalle', sql.Int, parseInt(idDetalle))
      .input('estadoProduccion', sql.NVarChar(20), estadoProduccion)
      .query(`
        UPDATE PedidoDetalle SET estadoProduccion = @estadoProduccion
        OUTPUT INSERTED.*
        WHERE idDetalle = @idDetalle
      `);
    return result.recordset[0] ? new OrderDetail(result.recordset[0]) : null;
  }

  async updateOrderStatus(idPedido, estado) {
    const pool = await getConnection();
    await pool.request()
      .input('idPedido', sql.Int, parseInt(idPedido))
      .input('estado', sql.NVarChar(20), estado)
      .query(`UPDATE Pedidos SET estado = @estado, fechaActualizacion = GETDATE() WHERE idPedido = @idPedido`);
  }

  async getOrderStatistics() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        (SELECT COUNT(DISTINCT idEmpresa) FROM Pedidos WHERE estado != 'eliminado') AS totalEmpresas,
        (SELECT COUNT(DISTINCT idComedor) FROM Pedidos WHERE estado != 'eliminado') AS totalComedores,
        (SELECT COUNT(DISTINCT semana) FROM Pedidos WHERE estado != 'eliminado') AS totalSemanas
    `);
    return result.recordset[0];
  }

  async findExistingOrder(idMenu, idComedor, semana) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idMenu', sql.Int, parseInt(idMenu))
      .input('idComedor', sql.Int, parseInt(idComedor))
      .input('semana', sql.NVarChar(50), semana)
      .query(`
        SELECT * FROM Pedidos
        WHERE idMenu = @idMenu AND idComedor = @idComedor AND semana = @semana AND estado != 'eliminado'
      `);
    return result.recordset[0] ? new Order(result.recordset[0]) : null;
  }

  async createOrder(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idMenu', sql.Int, parseInt(data.idMenu))
      .input('idEmpresa', sql.Int, parseInt(data.idEmpresa))
      .input('idComedor', sql.Int, parseInt(data.idComedor))
      .input('semana', sql.NVarChar(50), data.semana)
      .input('fechaInicio', sql.Date, data.fechaInicio)
      .input('fechaFin', sql.Date, data.fechaFin)
      .query(`
        INSERT INTO Pedidos (idMenu, idEmpresa, idComedor, semana, fechaInicio, fechaFin)
        OUTPUT INSERTED.*
        VALUES (@idMenu, @idEmpresa, @idComedor, @semana, @fechaInicio, @fechaFin)
      `);
    return new Order(result.recordset[0]);
  }

  async getCompanyById(idEmpresa) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idEmpresa', sql.Int, parseInt(idEmpresa))
      .query(`SELECT * FROM Empresas WHERE idEmpresa = @idEmpresa AND estado != 'eliminado'`);
    return result.recordset[0] || null;
  }

  async getDiningRoomById(idComedor) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idComedor', sql.Int, parseInt(idComedor))
      .query(`SELECT * FROM Comedores WHERE idComedor = @idComedor AND estado != 'eliminado'`);
    return result.recordset[0] || null;
  }

  async getMenuById(idMenu) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idMenu', sql.Int, parseInt(idMenu))
      .query(`SELECT * FROM Menus WHERE idMenu = @idMenu AND estado != 'eliminado'`);
    return result.recordset[0] || null;
  }

  async createOrderDetail(data) {
    const pool = await getConnection();
    await pool.request()
      .input('idPedido', sql.Int, parseInt(data.idPedido))
      .input('diaSemana', sql.NVarChar(20), data.diaSemana)
      .input('tipoComida', sql.NVarChar(20), data.tipoComida)
      .input('idPlatillo', sql.Int, parseInt(data.idPlatillo))
      .query(`
        INSERT INTO PedidoDetalle (idPedido, diaSemana, tipoComida, idPlatillo)
        VALUES (@idPedido, @diaSemana, @tipoComida, @idPlatillo)
      `);
  }

  

}

module.exports = SqlOrderRepository;