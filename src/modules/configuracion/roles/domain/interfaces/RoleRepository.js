class RoleRepository {
  async createRole(data) { throw new Error('Not implemented'); }
  async updateRole(idRol, data) { throw new Error('Not implemented'); }
  async deleteRole(idRol) { throw new Error('Not implemented'); }
  async getRoleById(idRol) { throw new Error('Not implemented'); }
  async getAllRoles({ page, limit, orderBy, orderDir }) { throw new Error('Not implemented'); }
  async searchRoles({ search, estado, page, limit }) { throw new Error('Not implemented'); }
  async changeRoleStatus(idRol, estado) { throw new Error('Not implemented'); }
  async assignPermissions(idRol, permisos) { throw new Error('Not implemented'); }
  async getRolePermissions(idRol) { throw new Error('Not implemented'); }
  async countUsersByRole(idRol) { throw new Error('Not implemented'); }
  async findByName(nombre) { throw new Error('Not implemented'); }
  async getRolesStatistics() { throw new Error('Not implemented'); }
  async validatePermissions(permisos) { throw new Error('Not implemented'); }
}

module.exports = RoleRepository;