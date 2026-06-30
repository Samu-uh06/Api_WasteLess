const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const MenuRepository = require('../../domain/interfaces/MenuRepository');
const Menu = require('../../domain/entities/Menu');
const MenuDetail = require('../../domain/entities/MenuDetail');

const VALID_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const VALID_MEAL_TYPES = ['Desayuno', 'Almuerzo', 'Media tarde'];

class SqlMenuRepository extends MenuRepository {
  async createMenu(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('codigo', sql.NVarChar(50), data.codigo)
      .input('nombre', sql.NVarChar(150), data.nombre)
      .input('idComedor', sql.Int, data.idComedor)
      .input('fechaInicio', sql.Date, data.fechaInicio)
      .input('fechaFin', sql.Date, data.fechaFin)
      .query(`
        INSERT INTO Menus (codigo, nombre, idComedor, fechaInicio, fechaFin)
        OUTPUT INSERTED.*
        VALUES (@codigo, @nombre, @idComedor, @fechaInicio, @fechaFin)
      `);
    return new Menu(result.recordset[0]);
  }

  async updateMenu(idMenu, data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idMenu', sql.Int, idMenu)
      .input('codigo', sql.NVarChar(50), data.codigo)
      .input('nombre', sql.NVarChar(150), data.nombre)
      .input('idComedor', sql.Int, data.idComedor)
      .input('fechaInicio', sql.Date, data.fechaInicio)
      .input('fechaFin', sql.Date, data.fechaFin)
      .query(`
        UPDATE Menus SET
          codigo = @codigo, nombre = @nombre, idComedor = @idComedor,
          fechaInicio = @fechaInicio, fechaFin = @fechaFin,
          fechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE idMenu = @idMenu
      `);
    return result.recordset[0] ? new Menu(result.recordset[0]) : null;
  }

   async deleteMenu(idMenu) {
   const pool = await getConnection();
   await pool.request()
      .input('idMenu', sql.Int, idMenu)
      .query(`
        UPDATE Menus SET 
           estado = 'eliminado',
           codigo = CONCAT(codigo, '_eliminado_', idMenu),
           fechaActualizacion = GETDATE()
        WHERE idMenu = @idMenu
      `);
 }


  async getMenuById(idMenu) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idMenu', sql.Int, idMenu)
      .query(`
        SELECT m.*, c.nombre AS nombreComedor
        FROM Menus m
        LEFT JOIN Comedores c ON m.idComedor = c.idComedor
        WHERE m.idMenu = @idMenu AND m.estado != 'eliminado'
      `);
    return result.recordset[0] ? new Menu(result.recordset[0]) : null;
  }

  async getAllMenus({ page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC', idComedor }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE m.estado != 'eliminado'`;
    if (idComedor) {
      request.input('idComedor', sql.Int, idComedor);
      filter += ` AND m.idComedor = @idComedor`;
    }

    const result = await request.query(`
      SELECT m.*, c.nombre AS nombreComedor, COUNT(*) OVER() AS totalRegistros
      FROM Menus m
      LEFT JOIN Comedores c ON m.idComedor = c.idComedor
      ${filter}
      ORDER BY m.${orderBy} ${orderDir}
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new Menu(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async searchMenus({ search = '', idComedor, estado, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('search', sql.NVarChar(200), `%${search}%`)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE m.estado != 'eliminado' AND (m.nombre LIKE @search OR m.codigo LIKE @search)`;

    if (idComedor) {
      request.input('idComedor', sql.Int, idComedor);
      filter += ` AND m.idComedor = @idComedor`;
    }
    if (estado) {
      request.input('estado', sql.NVarChar(20), estado);
      filter += ` AND m.estado = @estado`;
    }

    const result = await request.query(`
      SELECT m.*, c.nombre AS nombreComedor, COUNT(*) OVER() AS totalRegistros
      FROM Menus m
      LEFT JOIN Comedores c ON m.idComedor = c.idComedor
      ${filter}
      ORDER BY m.fechaCreacion DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new Menu(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async changeMenuStatus(idMenu, estado) {
    const pool = await getConnection();
    await pool.request()
      .input('idMenu', sql.Int, idMenu)
      .input('estado', sql.NVarChar(20), estado)
      .query(`UPDATE Menus SET estado = @estado, fechaActualizacion = GETDATE() WHERE idMenu = @idMenu`);
  }

  async getMenuPlanning(idMenu) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idMenu', sql.Int, idMenu)
      .query(`
        SELECT md.*, p.nombre AS nombrePlatillo, p.precio, p.imagen
        FROM MenuDetalle md
        LEFT JOIN Platillos p ON md.idPlatillo = p.idPlatillo
        WHERE md.idMenu = @idMenu
        ORDER BY 
          CASE md.diaSemana
            WHEN 'Lunes' THEN 1 WHEN 'Martes' THEN 2 WHEN 'Miércoles' THEN 3
            WHEN 'Jueves' THEN 4 WHEN 'Viernes' THEN 5 WHEN 'Sábado' THEN 6
          END,
          CASE md.tipoComida
            WHEN 'Desayuno' THEN 1 WHEN 'Almuerzo' THEN 2 WHEN 'Media tarde' THEN 3
          END
      `);
    return result.recordset.map(r => new MenuDetail(r));
  }

  async assignDishToMenu(idMenu, { diaSemana, tipoComida, idPlatillo }) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idMenu', sql.Int, idMenu)
      .input('diaSemana', sql.NVarChar(20), diaSemana)
      .input('tipoComida', sql.NVarChar(20), tipoComida)
      .input('idPlatillo', sql.Int, idPlatillo)
      .query(`
        INSERT INTO MenuDetalle (idMenu, diaSemana, tipoComida, idPlatillo)
        OUTPUT INSERTED.*
        VALUES (@idMenu, @diaSemana, @tipoComida, @idPlatillo)
      `);
    return new MenuDetail(result.recordset[0]);
  }

  async removeDishFromMenu(idDetalle) {
    const pool = await getConnection();
    await pool.request()
      .input('idDetalle', sql.Int, idDetalle)
      .query(`DELETE FROM MenuDetalle WHERE idDetalle = @idDetalle`);
  }

  async getMenuStatistics() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) AS activos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) AS inactivos,
        COUNT(DISTINCT idComedor) AS comedoresAsignados
      FROM Menus
      WHERE estado != 'eliminado'
    `);
    return result.recordset[0];
  }

  async findByCode(codigo) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('codigo', sql.NVarChar(50), codigo)
      .query(`SELECT * FROM Menus WHERE codigo = @codigo AND estado != 'eliminado'`);
    return result.recordset[0] ? new Menu(result.recordset[0]) : null;
  }

  async getDetailById(idDetalle) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idDetalle', sql.Int, idDetalle)
      .query(`SELECT * FROM MenuDetalle WHERE idDetalle = @idDetalle`);
    return result.recordset[0] ? new MenuDetail(result.recordset[0]) : null;
  }
}

module.exports = SqlMenuRepository;