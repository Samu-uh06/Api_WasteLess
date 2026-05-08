const { UserNotFoundException } = require('../../domain/exceptions/UserExceptions');
const logger = require('../../../../../shared/utils/logger');

class ChangeUserStatus {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(idUsuario, estado) {
    const user = await this.userRepository.getUserById(idUsuario);
    if (!user) throw new UserNotFoundException();

    await this.userRepository.changeUserStatus(idUsuario, estado);

    logger.info({ action: 'CHANGE_USER_STATUS', idUsuario, estado });

    return { message: `Usuario ${estado} correctamente` };
  }
}

module.exports = ChangeUserStatus;