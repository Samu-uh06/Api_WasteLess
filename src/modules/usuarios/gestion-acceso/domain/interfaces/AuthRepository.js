class AuthRepository {
  async findByEmail(email) { throw new Error('Not implemented'); }
  async saveSession(session) { throw new Error('Not implemented'); }
  async revokeSession(idSesion) { throw new Error('Not implemented'); }
  async findSessionByRefreshToken(refreshToken) { throw new Error('Not implemented'); }
  async saveRecoveryToken(idUsuario, token, expiracion) { throw new Error('Not implemented'); }
  async findRecoveryToken(token) { throw new Error('Not implemented'); }
  async invalidateRecoveryToken(token) { throw new Error('Not implemented'); }
  async updatePassword(idUsuario, hashedPassword) { throw new Error('Not implemented'); }
  async updateProfile(idUsuario, data) { throw new Error('Not implemented'); }
  async getUserPermissions(idUsuario) { throw new Error('Not implemented'); }
}

module.exports = AuthRepository;