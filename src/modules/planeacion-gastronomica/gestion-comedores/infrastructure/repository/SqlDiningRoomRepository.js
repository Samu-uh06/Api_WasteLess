const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const DiningRoomRepository = require('../../domain/interfaces/DiningRoomRepository');
const DiningRoom = require('../../domain/entities/DiningRoom');

class SqlDiningRoomRepository extends DiningRoomRepository {
  async createDiningRoom(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(150), data.nombre)
      .input('idEmpresa', sql.Int, data.idEmpresa)
      .input('direccion', sql.NVarChar(300), data.direccion)
      .input('capacidad', sql.Int, data.capacidad)
      .input('totalEmpleados', sql.Int, data.totalEmpleados || 0)
      .input('encargado', sql.NVarChar(150), data.encargado || null)
      .input('telefono', sql.NVarChar(20), data.telefono || null)
      .input('horario', sql.NVarChar(100), data.horario || null)
      .input('descripcion', sql.NVarChar(500), data.descripcion || null)
      .query(`
        INSERT INTO Comedores (nombre, idEmpresa, direccion, capacidad, totalEmpleados, encargado, telefono, horario, descripcion)
        OUTPUT INSERTED.*
        VALUES (@nombre, @idEmpresa, @direccion, @capacidad, @totalEmpleados, @encargado, @telefono, @horario, @descripcion)
      `);
    return new DiningRoom(result.recordset[0]);
  }

  async updateDiningRoom(idComedor, data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idComedor', sql.Int, idComedor)
      .input('nombre', sql.NVarChar(150), data.nombre)
      .input('idEmpresa', sql.Int, data.idEmpresa)
      .input('direccion', sql.NVarChar(300), data.direccion)
      .input('capacidad', sql.Int, data.capacidad)
      .input('totalEmpleados', sql.Int, data.totalEmpleados || 0)
      .input('encargado', sql.NVarChar(150), data.encargado || null)
      .input('telefono', sql.NVarChar(20), data.telefono || null)
      .input('horario', sql.NVarChar(100), data.horario || null)
      .input('descripcion', sql.NVarChar(500), data.descripcion || null)
      .query(`
        UPDATE Comedores SET
          nombre = @nombre, idEmpresa = @idEmpresa, direccion = @direccion,
          capacidad = @capacidad, totalEmpleados = @totalEmpleados,
          encargado = @encargado, telefono = @telefono, horario = @horario,
          descripcion = @descripcion, fechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE idComedor = @idComedor
      `);
    return result.recordset[0] ? new DiningRoom(result.recordset[0]) : null;
  }

  async deleteDiningRoom(idComedor) {
    const pool = await getConnection();
    await pool.request()
      .input('idComedor', sql.Int, idComedor)
      .query(`UPDATE Comedores SET estado = 'eliminado', fechaActualizacion = GETDATE() WHERE idComedor = @idComedor`);
  }

  async getDiningRoomById(idComedor) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idComedor', sql.Int, idComedor)
      .query(`
        SELECT c.*, e.nombreEmpresa
        FROM Comedores c
        LEFT JOIN Empresas e ON c.idEmpresa = e.idEmpresa
        WHERE c.idComedor = @idComedor AND c.estado != 'eliminado'
      `);
    return result.recordset[0] ? new DiningRoom(result.recordset[0]) : null;
  }

  async getAllDiningRooms({ page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC', idEmpresa }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE c.estado != 'eliminado'`;
    if (idEmpresa) {
      request.input('idEmpresa', sql.Int, idEmpresa);
      filter += ` AND c.idEmpresa = @idEmpresa`;
    }

    const result = await request.query(`
      SELECT c.*, e.nombreEmpresa, COUNT(*) OVER() AS totalRegistros
      FROM Comedores c
      LEFT JOIN Empresas e ON c.idEmpresa = e.idEmpresa
      ${filter}
      ORDER BY c.${orderBy} ${orderDir}
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new DiningRoom(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async searchDiningRooms({ search = '', idEmpresa, estado, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('search', sql.NVarChar(200), `%${search}%`)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE c.estado != 'eliminado' AND (c.nombre LIKE @search OR e.nombreEmpresa LIKE @search)`;

    if (idEmpresa) {
      request.input('idEmpresa', sql.Int, idEmpresa);
      filter += ` AND c.idEmpresa = @idEmpresa`;
    }
    if (estado) {
      request.input('estado', sql.NVarChar(20), estado);
      filter += ` AND c.estado = @estado`;
    }

    const result = await request.query(`
      SELECT c.*, e.nombreEmpresa, COUNT(*) OVER() AS totalRegistros
      FROM Comedores c
      LEFT JOIN Empresas e ON c.idEmpresa = e.idEmpresa
      ${filter}
      ORDER BY c.fechaCreacion DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new DiningRoom(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async changeDiningRoomStatus(idComedor, estado) {
    const pool = await getConnection();
    await pool.request()
      .input('idComedor', sql.Int, idComedor)
      .input('estado', sql.NVarChar(20), estado)
      .query(`UPDATE Comedores SET estado = @estado, fechaActualizacion = GETDATE() WHERE idComedor = @idComedor`);
  }

  async getDiningRoomStatistics() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(capacidad) AS capacidadTotal,
        SUM(totalEmpleados) AS totalEmpleados,
        COUNT(DISTINCT idEmpresa) AS empresasConComedores
      FROM Comedores
      WHERE estado != 'eliminado'
    `);
    return result.recordset[0];
  }

  async findByNameAndCompany(nombre, idEmpresa) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(150), nombre)
      .input('idEmpresa', sql.Int, idEmpresa)
      .query(`
        SELECT * FROM Comedores 
        WHERE nombre = @nombre AND idEmpresa = @idEmpresa AND estado != 'eliminado'
      `);
    return result.recordset[0] ? new DiningRoom(result.recordset[0]) : null;
  }

  async hasDependencies(idComedor) {
    // Preparado para cuando existan las tablas de Menus y Pedidos
    // Por ahora retorna false ya que esas tablas aún no existen
    return false;
  }
}

module.exports = SqlDiningRoomRepository;