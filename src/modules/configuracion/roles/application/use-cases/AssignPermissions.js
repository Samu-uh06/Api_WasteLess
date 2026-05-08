const { RoleNotFoundException, InvalidPermissionsException } = require('../../domain/exceptions/RoleExceptions');
const logger = require('../../../../../shared/utils/logger');

class AssignPermissions {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(idRol, permisos) {
    const role = await this.roleRepository.getRoleById(idRol);
    if (!role) throw new RoleNotFoundException();

    const valid = await this.roleRepository.validatePermissions(permisos);
    if (!valid) throw new InvalidPermissionsException();

    await this.roleRepository.assignPermissions(idRol, permisos);

    logger.info({ action: 'ASSIGN_PERMISSIONS', idRol, permisos });

    return { message: 'Permisos asignados correctamente' };
  }
}

module.exports = AssignPermissions;