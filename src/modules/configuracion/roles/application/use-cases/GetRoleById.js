const { RoleNotFoundException } = require('../../domain/exceptions/RoleExceptions');

class GetRoleById {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(idRol) {
    const role = await this.roleRepository.getRoleById(idRol);
    if (!role) throw new RoleNotFoundException();

    const permisos = await this.roleRepository.getRolePermissions(idRol);
    const totalUsuarios = await this.roleRepository.countUsersByRole(idRol);

    return { ...role, permisos, totalUsuarios };
  }
}

module.exports = GetRoleById;