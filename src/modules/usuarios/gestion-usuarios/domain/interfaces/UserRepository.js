class UserRepository {
  async createUser(data) { throw new Error('Not implemented'); }
  async updateUser(idUsuario, data) { throw new Error('Not implemented'); }
  async deleteUser(idUsuario) { throw new Error('Not implemented'); }
  async getUserById(idUsuario) { throw new Error('Not implemented'); }
  async getAllUsers({ page, limit, orderBy, orderDir }) { throw new Error('Not implemented'); }
  async searchUsers({ search, estado, idRol, page, limit }) { throw new Error('Not implemented'); }
  async changeUserStatus(idUsuario, estado) { throw new Error('Not implemented'); }
  async assignRoleToUser(idUsuario, idRol) { throw new Error('Not implemented'); }
  async findByEmail(email) { throw new Error('Not implemented'); }
  async findByDocument(numeroDocumento) { throw new Error('Not implemented'); }
  async getUsersStatistics() { throw new Error('Not implemented'); }
}

module.exports = UserRepository;