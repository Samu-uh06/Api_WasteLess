const { RoleNotFoundException, RoleHasUsersException } = require('../../domain/exceptions/RoleExceptions');
const logger = require('../../../../../shared/utils/logger');

class DeleteRole {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(idRol) {
    const role = await this.roleRepository.getRoleById(idRol);
    if (!role) throw new RoleNotFoundException();

    const usersCount = await this.roleRepository.countUsersByRole(idRol);
    if (usersCount > 0) throw new RoleHasUsersException();

    await this.roleRepository.deleteRole(idRol);

    logger.info({ action: 'DELETE_ROLE', idRol });
  }
}

module.exports = DeleteRole;