const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const CompanyRepository = require('../../domain/interfaces/CompanyRepository');
const Company = require('../../domain/entities/Company');
const City = require('../../domain/entities/City');

class SqlCompanyRepository extends CompanyRepository {
  async createCompany(data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nombreEmpresa', sql.NVarChar(200), data.nombreEmpresa)
      .input('tipoEmpresa', sql.NVarChar(20), data.tipoEmpresa)
      .input('nit', sql.NVarChar(50), data.nit)
      .input('idCiudad', sql.Int, data.idCiudad)
      .input('direccion', sql.NVarChar(300), data.direccion || null)
      .input('nombreContacto', sql.NVarChar(150), data.nombreContacto || null)
      .input('emailContacto', sql.NVarChar(150), data.emailContacto || null)
      .input('telefonoContacto', sql.NVarChar(20), data.telefonoContacto || null)
      .query(`
        INSERT INTO Empresas (nombreEmpresa, tipoEmpresa, nit, idCiudad, direccion, nombreContacto, emailContacto, telefonoContacto)
        OUTPUT INSERTED.*
        VALUES (@nombreEmpresa, @tipoEmpresa, @nit, @idCiudad, @direccion, @nombreContacto, @emailContacto, @telefonoContacto)
      `);
    return new Company(result.recordset[0]);
  }

  async updateCompany(idEmpresa, data) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idEmpresa', sql.Int, idEmpresa)
      .input('nombreEmpresa', sql.NVarChar(200), data.nombreEmpresa)
      .input('tipoEmpresa', sql.NVarChar(20), data.tipoEmpresa)
      .input('nit', sql.NVarChar(50), data.nit)
      .input('idCiudad', sql.Int, data.idCiudad)
      .input('direccion', sql.NVarChar(300), data.direccion || null)
      .input('nombreContacto', sql.NVarChar(150), data.nombreContacto || null)
      .input('emailContacto', sql.NVarChar(150), data.emailContacto || null)
      .input('telefonoContacto', sql.NVarChar(20), data.telefonoContacto || null)
      .query(`
        UPDATE Empresas SET
          nombreEmpresa = @nombreEmpresa, tipoEmpresa = @tipoEmpresa,
          nit = @nit, idCiudad = @idCiudad, direccion = @direccion,
          nombreContacto = @nombreContacto, emailContacto = @emailContacto,
          telefonoContacto = @telefonoContacto, fechaActualizacion = GETDATE()
        OUTPUT INSERTED.*
        WHERE idEmpresa = @idEmpresa
      `);
    return result.recordset[0] ? new Company(result.recordset[0]) : null;
  }

  async deleteCompany(idEmpresa) {
    const pool = await getConnection();
    await pool.request()
      .input('idEmpresa', sql.Int, idEmpresa)
      .query(`
        UPDATE Empresas 
        SET 
          estado = 'eliminado',
          nit = CONCAT(nit, '_deleted_', CAST(idEmpresa AS NVARCHAR)),
          fechaActualizacion = GETDATE()
        WHERE idEmpresa = @idEmpresa
      `);
  }

  async getCompanyById(idEmpresa) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idEmpresa', sql.Int, idEmpresa)
      .query(`
        SELECT e.*, c.nombre AS nombreCiudad, c.departamento
        FROM Empresas e
        LEFT JOIN Ciudades c ON e.idCiudad = c.idCiudad
        WHERE e.idEmpresa = @idEmpresa AND e.estado != 'eliminado'
      `);
    return result.recordset[0] ? new Company(result.recordset[0]) : null;
  }

  async getAllCompanies({ page = 1, limit = 10, orderBy = 'fechaRegistro', orderDir = 'DESC', tipoEmpresa }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE e.estado != 'eliminado'`;
    if (tipoEmpresa) {
      request.input('tipoEmpresa', sql.NVarChar(20), tipoEmpresa);
      filter += ` AND e.tipoEmpresa = @tipoEmpresa`;
    }

    const result = await request.query(`
      SELECT e.*, c.nombre AS nombreCiudad, c.departamento,
        COUNT(*) OVER() AS totalRegistros
      FROM Empresas e
      LEFT JOIN Ciudades c ON e.idCiudad = c.idCiudad
      ${filter}
      ORDER BY e.${orderBy} ${orderDir}
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new Company(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async searchCompanies({ search = '', tipoEmpresa, estado, page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const pool = await getConnection();
    const request = pool.request()
      .input('search', sql.NVarChar(200), `%${search}%`)
      .input('limit', sql.Int, limit)
      .input('offset', sql.Int, offset);

    let filter = `WHERE e.estado != 'eliminado' AND (
      e.nombreEmpresa LIKE @search OR e.nit LIKE @search OR c.nombre LIKE @search
    )`;

    if (tipoEmpresa) {
      request.input('tipoEmpresa', sql.NVarChar(20), tipoEmpresa);
      filter += ` AND e.tipoEmpresa = @tipoEmpresa`;
    }
    if (estado) {
      request.input('estado', sql.NVarChar(20), estado);
      filter += ` AND e.estado = @estado`;
    }

    const result = await request.query(`
      SELECT e.*, c.nombre AS nombreCiudad, c.departamento,
        COUNT(*) OVER() AS totalRegistros
      FROM Empresas e
      LEFT JOIN Ciudades c ON e.idCiudad = c.idCiudad
      ${filter}
      ORDER BY e.fechaRegistro DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    return {
      data: result.recordset.map(r => new Company(r)),
      total: result.recordset[0]?.totalRegistros || 0,
      page,
      limit,
    };
  }

  async changeCompanyStatus(idEmpresa, estado) {
    const pool = await getConnection();
    await pool.request()
      .input('idEmpresa', sql.Int, idEmpresa)
      .input('estado', sql.NVarChar(20), estado)
      .query(`UPDATE Empresas SET estado = @estado, fechaActualizacion = GETDATE() WHERE idEmpresa = @idEmpresa`);
  }

  async getCompanyStatistics() {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN tipoEmpresa = 'Jurídica' THEN 1 ELSE 0 END) AS juridicas,
        SUM(CASE WHEN tipoEmpresa = 'Natural' THEN 1 ELSE 0 END) AS naturales,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) AS activas,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) AS inactivas
      FROM Empresas
      WHERE estado != 'eliminado'
    `);
    return result.recordset[0];
  }

  async getCompanyIndicators(idEmpresa) {
    // Por ahora retorna en 0, se conectará en el sprint de producción
    return {
      idEmpresa,
      totalPedidos: 0,
      facturacionTotal: 0,
      pedidosMes: 0,
      facturacionMes: 0,
    };
  }

  async findByNit(nit) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('nit', sql.NVarChar(50), nit)
      .query(`SELECT * FROM Empresas WHERE nit = @nit AND estado != 'eliminado'`);
    return result.recordset[0] ? new Company(result.recordset[0]) : null;
  }

  async getAllCities() {
    const pool = await getConnection();
    const result = await pool.request()
      .query(`SELECT * FROM Ciudades ORDER BY nombre ASC`);
    return result.recordset.map(r => new City(r));
  }

  async getCityById(idCiudad) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idCiudad', sql.Int, idCiudad)
      .query(`SELECT * FROM Ciudades WHERE idCiudad = @idCiudad`);
    return result.recordset[0] ? new City(result.recordset[0]) : null;
  }
}

module.exports = SqlCompanyRepository;