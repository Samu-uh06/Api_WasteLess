const { RoleNotFoundException } = require('../../domain/exceptions/RoleExceptions');
const logger = require('../../../../../shared/utils/logger');

class ChangeRoleStatus {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(idRol, estado) {
    const role = await this.roleRepository.getRoleById(idRol);
    if (!role) throw new RoleNotFoundException();

    await this.roleRepository.changeRoleStatus(idRol, estado);

    logger.info({ action: 'CHANGE_ROLE_STATUS', idRol, estado });

    return { message: `Rol ${estado} correctamente` };
  }
}

module.exports = ChangeRoleStatus;