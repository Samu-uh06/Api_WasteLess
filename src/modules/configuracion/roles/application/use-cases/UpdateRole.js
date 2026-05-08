const { RoleNotFoundException, RoleNameDuplicatedException } = require('../../domain/exceptions/RoleExceptions');
const logger = require('../../../../../shared/utils/logger');

class UpdateRole {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(idRol, { nombre, descripcion }) {
    const existing = await this.roleRepository.getRoleById(idRol);
    if (!existing) throw new RoleNotFoundException();

    if (nombre !== existing.nombre) {
      const nameTaken = await this.roleRepository.findByName(nombre);
      if (nameTaken) throw new RoleNameDuplicatedException();
    }

    const updated = await this.roleRepository.updateRole(idRol, { nombre, descripcion });

    logger.info({ action: 'UPDATE_ROLE', idRol, nombre });

    return updated;
  }
}

module.exports = UpdateRole;