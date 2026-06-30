const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const RoleRepository = require('../../domain/interfaces/RoleRepository');
const Role = require('../../domain/entities/Role');
const Permission = require('../../domain/entities/Permission');

class SqlRoleRepository extends RoleRepository {
  async createRole(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), data.nombre)
      .input('descripcion', sql.NVarChar(300), data.descripcion || null)
      .query(`
        INSERT INTO Roles (nombre, descripcion)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion)
      `);
    return new Role(result.recordset[0]);
  }

  async updateRole(idRol, data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idRol', sql.Int, idRol)
      .input('nombre', sql.NVarChar(100), data.nombre)
      .input('descripcion', sql.NVarChar(300), data.descripcion || null)
      .query(`
        UPDATE Roles SET
          nombre = @nombre,
          descripcion = @descripcion,
          fechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE idRol = @idRol
      `);
    if (!result.recordset[0]) return null;
    return new Role(result.recordset[0]);
  }

  async deleteRole(idRol) {
    const pool = await getConnection();
    await pool.request()
      .input('idRol', sql.Int, idRol)
      .query(`
        UPDATE Roles SET 
          estado = 'eliminado', 
          nombre = nombre + '_eliminado_' + CAST(idRol AS NVARCHAR(10)),
          fechaActualizacion = GETDATE()
        WHERE idRol = @idRol
      `);
  }

  async getRoleById(idRol) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idRol', sql.Int, idRol)
      .query(`SELECT * FROM Roles WHERE idRol = @idRol AND estado != 'eliminado'`);
    if (!result.recordset[0]) return null;
    return new Role(result.recordset[0]);
  }

  async getAllRoles({ page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC' }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const result = await pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset)
      .query(`
        SELECT *, COUNT(*) OVER() AS totalRegistros
        FROM Roles
        WHERE estado != 'eliminado'
        ORDER BY ${orderBy} ${orderDir}
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);
    const roles = result.recordset.map(r => new Role(r));
    for (const role of roles) {
      role.permisos = await this.getRolePermissions(role.idRol);
      role.totalUsuarios = await this.countUsersByRole(role.idRol);
    }
    return {
      data: roles,
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async searchRoles({ search = '', estado, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('search', sql.NVarChar(200), `%${search}%`)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filters = `WHERE estado != 'eliminado' AND nombre LIKE @search`;

    if (estado) {
      request.input('estado', sql.NVarChar(20), estado);
      filters += ` AND estado = @estado`;
    }

    const result = await request.query(`
      SELECT *, COUNT(*) OVER() AS totalRegistros
      FROM Roles
      ${filters}
      ORDER BY fechaCreacion DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    const roles = result.recordset.map(r => new Role(r));
    for (const role of roles) {
      role.permisos = await this.getRolePermissions(role.idRol);
      role.totalUsuarios = await this.countUsersByRole(role.idRol);
    }
    return {
      data: roles,
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async changeRoleStatus(idRol, estado) {
    const pool = await getConnection();
    await pool.request()
      .input('idRol', sql.Int, idRol)
      .input('estado', sql.NVarChar(20), estado)
      .query(`
        UPDATE Roles SET estado = @estado, fechaActualizacion = GETDATE()
        WHERE idRol = @idRol
      `);
  }

  async assignPermissions(idRol, permisos) {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      await new sql.Request(transaction)
        .input('idRol', sql.Int, idRol)
        .query(`DELETE FROM RolPermiso WHERE idRol = @idRol`);

      for (const idPermiso of permisos) {
        await new sql.Request(transaction)
          .input('idRol', sql.Int, idRol)
          .input('idPermiso', sql.Int, idPermiso)
          .query(`INSERT INTO RolPermiso (idRol, idPermiso) VALUES (@idRol, @idPermiso)`);
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getRolePermissions(idRol) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idRol', sql.Int, idRol)
      .query(`
        SELECT p.*
        FROM Permisos p
        INNER JOIN RolPermiso rp ON p.idPermiso = rp.idPermiso
        WHERE rp.idRol = @idRol
      `);
    return result.recordset.map(r => new Permission(r));
  }

  async countUsersByRole(idRol) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idRol', sql.Int, idRol)
      .query(`SELECT COUNT(*) AS total FROM Usuarios WHERE idRol = @idRol AND estado != 'eliminado'`);
    return result.recordset[0].total;
  }

  async findByName(nombre) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), nombre)
      .query(`SELECT * FROM Roles WHERE nombre = @nombre AND estado != 'eliminado'`);
    return result.recordset[0] ? new Role(result.recordset[0]) : null;
  }

  async getRolesStatistics() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) AS activos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) AS inactivos,
        (SELECT COUNT(*) FROM Usuarios WHERE estado != 'eliminado') AS totalUsuariosAsignados
      FROM Roles
      WHERE estado != 'eliminado'
    `);
    return result.recordset[0];
  }

  async validatePermissions(permisos) {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT idPermiso FROM Permisos`);
    const validIds = result.recordset.map(r => Number(r.idPermiso));
    return permisos.every(id => validIds.includes(Number(id)));
  }
}

module.exports = SqlRoleRepository;