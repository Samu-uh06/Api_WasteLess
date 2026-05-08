const { getConnection, sql } = require('../../../../../shared/database/sqlServerConnection');
const AuthRepository = require('../../domain/interfaces/AuthRepository');
const Auth = require('../../domain/entities/Auth');
const Session = require('../../domain/entities/Session');

class SqlAuthRepository extends AuthRepository {
  async findByEmail(email) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`SELECT * FROM Usuarios WHERE email = @email`);

    if (!result.recordset[0]) return null;
    return new Auth(result.recordset[0]);
  }

  async getUserPermissions(idUsuario) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .query(`
        SELECT p.codigo FROM Permisos p
        INNER JOIN RolPermiso rp ON p.idPermiso = rp.idPermiso
        INNER JOIN Usuarios u ON u.idRol = rp.idRol
        WHERE u.idUsuario = @idUsuario
      `);
    return result.recordset.map(r => r.codigo);
  }

  async saveSession({ idUsuario, token, refreshToken, fechaExpiracion, ip, dispositivo }) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('token', sql.NVarChar(sql.MAX), token)
      .input('refreshToken', sql.NVarChar(500), refreshToken)
      .input('fechaExpiracion', sql.DateTime, fechaExpiracion)
      .input('ip', sql.NVarChar(50), ip)
      .input('dispositivo', sql.NVarChar(200), dispositivo)
      .query(`
        INSERT INTO Sesiones (idUsuario, token, refreshToken, fechaExpiracion, ip, dispositivo)
        OUTPUT INSERTED.*
        VALUES (@idUsuario, @token, @refreshToken, @fechaExpiracion, @ip, @dispositivo)
      `);
    return new Session(result.recordset[0]);
  }

  async revokeSession(idSesion) {
    const pool = await getConnection();
    await pool.request()
      .input('idSesion', sql.UniqueIdentifier, idSesion)
      .query(`UPDATE Sesiones SET estado = 'revocada' WHERE idSesion = @idSesion`);
  }

  async findSessionByRefreshToken(refreshToken) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('refreshToken', sql.NVarChar(500), refreshToken)
      .query(`SELECT * FROM Sesiones WHERE refreshToken = @refreshToken AND estado = 'activa'`);
    if (!result.recordset[0]) return null;
    return new Session(result.recordset[0]);
  }

  async saveRecoveryToken(idUsuario, token, expiracion) {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('token', sql.NVarChar(500), token)
      .input('expiracion', sql.DateTime, expiracion)
      .query(`
        INSERT INTO RecuperacionPassword (idUsuario, token, fechaExpiracion)
        VALUES (@idUsuario, @token, @expiracion)
      `);
  }

  async findRecoveryToken(token) {
    const pool = await getConnection();
    const result = await pool.request()
      .input('token', sql.NVarChar(500), token)
      .query(`SELECT * FROM RecuperacionPassword WHERE token = @token AND usado = 0`);
    return result.recordset[0] || null;
  }

  async invalidateRecoveryToken(token) {
    const pool = await getConnection();
    await pool.request()
      .input('token', sql.NVarChar(500), token)
      .query(`UPDATE RecuperacionPassword SET usado = 1 WHERE token = @token`);
  }

  async updatePassword(idUsuario, hashedPassword) {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('password', sql.NVarChar(500), hashedPassword)
      .query(`
        UPDATE Usuarios SET password = @password, fechaActualizacion = GETDATE()
        WHERE idUsuario = @idUsuario
      `);
  }

  async updateProfile(idUsuario, data) {
    const pool = await getConnection();
    await pool.request()
      .input('idUsuario', sql.Int, idUsuario)
      .input('nombres', sql.NVarChar(100), data.nombres)
      .input('apellidos', sql.NVarChar(100), data.apellidos)
      .input('telefono', sql.NVarChar(20), data.telefono)
      .query(`
        UPDATE Usuarios SET nombres = @nombres, apellidos = @apellidos,
        telefono = @telefono, fechaActualizacion = GETDATE()
        WHERE idUsuario = @idUsuario
      `);
  }
}

module.exports = SqlAuthRepository;