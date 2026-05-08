const logger = require('../../../../../shared/utils/logger');

class LogoutUser {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ idSesion, idUsuario }) {
    await this.authRepository.revokeSession(idSesion);
    logger.info({ action: 'LOGOUT', idUsuario });
  }
}

module.exports = LogoutUser;