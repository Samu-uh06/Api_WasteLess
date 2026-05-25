const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const UserRepository = require('../../domain/interfaces/UserRepository');
const User = require('../../domain/entities/User');

class SqlUserRepository extends UserRepository {
  async createUser(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombres', sql.NVarChar(100), data.nombres)
      .input('apellidos', sql.NVarChar(100), data.apellidos)
      .input('tipoDocumento', sql.NVarChar(20), data.tipoDocumento)
      .input('numeroDocumento', sql.NVarChar(50), data.numeroDocumento)
      .input('telefono', sql.NVarChar(20), data.telefono || null)
      .input('email', sql.NVarChar(150), data.email)
      .input('password', sql.NVarChar(500), data.password)
      .input('empresa', sql.NVarChar(150), data.empresa || null)
      .input('idRol', sql.Int, data.idRol)
      .query(`
        INSERT INTO Usuarios (nombres, apellidos, tipoDocumento, numeroDocumento, telefono, email, password, empresa, idRol)
        OUTPUT INSERTED.*
        VALUES (@nombres, @apellidos, @tipoDocumento, @numeroDocumento, @telefono, @email, @password, @empresa, @idRol)
      `);
    return new User(result.recordset[0]);
  }

  async updateUser(idUsuario, data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('nombres', sql.NVarChar(100), data.nombres)
      .input('apellidos', sql.NVarChar(100), data.apellidos)
      .input('tipoDocumento', sql.NVarChar(20), data.tipoDocumento)
      .input('numeroDocumento', sql.NVarChar(50), data.numeroDocumento)
      .input('telefono', sql.NVarChar(20), data.telefono || null)
      .input('empresa', sql.NVarChar(150), data.empresa || null)
      .input('idRol', sql.Int, data.idRol)
      .query(`
        UPDATE Usuarios SET
          nombres = @nombres, apellidos = @apellidos,
          tipoDocumento = @tipoDocumento, numeroDocumento = @numeroDocumento,
          telefono = @telefono, empresa = @empresa,
          idRol = @idRol, fechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE idUsuario = @idUsuario
      `);
    if (!result.recordset[0]) return null;
    return new User(result.recordset[0]);
  }

  async deleteUser(idUsuario) {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .query(`UPDATE Usuarios SET estado = 'eliminado', fechaActualizacion = GETDATE() WHERE idUsuario = @idUsuario`);
  }

  async getUserById(idUsuario) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .query(`
        SELECT u.*, r.nombre AS nombreRol
        FROM Usuarios u
        LEFT JOIN Roles r ON u.idRol = r.idRol
        WHERE u.idUsuario = @idUsuario AND u.estado != 'eliminado'
      `);
    if (!result.recordset[0]) return null;
    return new User(result.recordset[0]);
  }

  async getAllUsers({ page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC' }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const result = await pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset)
      .query(`
        SELECT u.*, r.nombre AS nombreRol,
          COUNT(*) OVER() AS totalRegistros
        FROM Usuarios u
        LEFT JOIN Roles r ON u.idRol = r.idRol
        WHERE u.estado != 'eliminado'
        ORDER BY u.${orderBy} ${orderDir}
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
    return {
      data: result.recordset.map(r => new User(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async searchUsers({ search = '', estado, idRol, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('search', sql.NVarChar(200), `%${search}%`)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filters = `WHERE u.estado != 'eliminado' AND (
      u.nombres LIKE @search OR u.apellidos LIKE @search OR
      u.email LIKE @search OR u.numeroDocumento LIKE @search
    )`;

    if (estado) {
      request.input('estado', sql.NVarChar(20), estado);
      filters += ` AND u.estado = @estado`;
    }
    if (idRol) {
      request.input('idRol', sql.Int, idRol);
      filters += ` AND u.idRol = @idRol`;
    }

    const result = await request.query(`
      SELECT u.*, r.nombre AS nombreRol,
        COUNT(*) OVER() AS totalRegistros
      FROM Usuarios u
      LEFT JOIN Roles r ON u.idRol = r.idRol
      ${filters}
      ORDER BY u.fechaCreacion DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new User(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async changeUserStatus(idUsuario, estado) {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('estado', sql.NVarChar(20), estado)
      .query(`UPDATE Usuarios SET estado = @estado, fechaActualizacion = GETDATE() WHERE idUsuario = @idUsuario`);
  }

  async assignRoleToUser(idUsuario, idRol) {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('idRol', sql.Int, idRol)
      .query(`UPDATE Usuarios SET idRol = @idRol, fechaActualizacion = GETDATE() WHERE idUsuario = @idUsuario`);
  }

  async findByEmail(email) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.NVarChar(150), email)
      .query(`SELECT * FROM Usuarios WHERE email = @email AND estado != 'eliminado'`);
    return result.recordset[0] ? new User(result.recordset[0]) : null;
  }

  async findByDocument(numeroDocumento) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('numeroDocumento', sql.NVarChar(50), numeroDocumento)
      .query(`SELECT * FROM Usuarios WHERE numeroDocumento = @numeroDocumento AND estado != 'eliminado'`);
    return result.recordset[0] ? new User(result.recordset[0]) : null;
  }

async getUsersStatistics() {
  const pool = await getConnection();
  const result = await pool.request().query(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN u.estado = 'activo' THEN 1 ELSE 0 END) AS activos,
      SUM(CASE WHEN u.estado = 'inactivo' THEN 1 ELSE 0 END) AS inactivos,
      SUM(CASE WHEN r.nombre = 'Administrador' THEN 1 ELSE 0 END) AS administradores
    FROM Usuarios u
    LEFT JOIN Roles r ON u.idRol = r.idRol
    WHERE u.estado != 'eliminado'
  `);
  return result.recordset[0];
}
}

module.exports = SqlUserRepository;