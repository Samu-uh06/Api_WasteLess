const { hashPassword } = require('../../../../../shared/utils/bcrypt');
const logger = require('../../../../../shared/utils/logger');

class UpdateProfile {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ idUsuario, nombres, apellidos, telefono, newPassword }) {
    await this.authRepository.updateProfile(idUsuario, { nombres, apellidos, telefono });

    if (newPassword) {
      const hashed = await hashPassword(newPassword);
      await this.authRepository.updatePassword(idUsuario, hashed);
    }

    logger.info({ action: 'UPDATE_PROFILE', idUsuario });
    return { message: 'Perfil actualizado correctamente' };
  }
}

module.exports = UpdateProfile;