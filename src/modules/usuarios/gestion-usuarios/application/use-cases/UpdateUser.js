const { UserNotFoundException, EmailDuplicatedException, DocumentDuplicatedException } = require('../../domain/exceptions/UserExceptions');
const logger = require('../../../../../shared/utils/logger');

class UpdateUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(idUsuario, data) {
    const existing = await this.userRepository.getUserById(idUsuario);
    if (!existing) throw new UserNotFoundException();

    if (data.email && data.email !== existing.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists) throw new EmailDuplicatedException();
    }

    if (data.numeroDocumento && data.numeroDocumento !== existing.numeroDocumento) {
      const docExists = await this.userRepository.findByDocument(data.numeroDocumento);
      if (docExists) throw new DocumentDuplicatedException();
    }

    const updated = await this.userRepository.updateUser(idUsuario, data);

    logger.info({ action: 'UPDATE_USER', idUsuario });

    return updated;
  }
}

module.exports = UpdateUser;