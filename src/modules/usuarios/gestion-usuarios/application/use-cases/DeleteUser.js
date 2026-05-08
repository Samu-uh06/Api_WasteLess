const { UserNotFoundException } = require('../../domain/exceptions/UserExceptions');
const logger = require('../../../../../shared/utils/logger');

class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(idUsuario) {
    const user = await this.userRepository.getUserById(idUsuario);
    if (!user) throw new UserNotFoundException();

    await this.userRepository.deleteUser(idUsuario);

    logger.info({ action: 'DELETE_USER', idUsuario });
  }
}

module.exports = DeleteUser;