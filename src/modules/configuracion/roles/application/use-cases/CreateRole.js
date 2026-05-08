const { RoleNameDuplicatedException, InvalidPermissionsException } = require('../../domain/exceptions/RoleExceptions');
const logger = require('../../../../../shared/utils/logger');

class CreateRole {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute({ nombre, descripcion, permisos = [] }) {
    const existing = await this.roleRepository.findByName(nombre);
    if (existing) throw new RoleNameDuplicatedException();

    if (permisos.length > 0) {
      const valid = await this.roleRepository.validatePermissions(permisos);
      if (!valid) throw new InvalidPermissionsException();
    }

    const role = await this.roleRepository.createRole({ nombre, descripcion });

    if (permisos.length > 0) {
      await this.roleRepository.assignPermissions(role.idRol, permisos);
    }

    logger.info({ action: 'CREATE_ROLE', idRol: role.idRol, nombre });

    return role;
  }
}

module.exports = CreateRole;