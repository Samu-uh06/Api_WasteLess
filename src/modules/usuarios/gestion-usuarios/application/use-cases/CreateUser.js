const { hashPassword } = require('../../../../../shared/utils/bcrypt');
const { EmailDuplicatedException, DocumentDuplicatedException, InvalidRoleException } = require('../../domain/exceptions/UserExceptions');
const logger = require('../../../../../shared/utils/logger');

class CreateUser {
  constructor(userRepository, roleRepository) {
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
  }

  async execute(data) {
    const emailExists = await this.userRepository.findByEmail(data.email);
    if (emailExists) throw new EmailDuplicatedException();

    const docExists = await this.userRepository.findByDocument(data.numeroDocumento);
    if (docExists) throw new DocumentDuplicatedException();

    const role = await this.roleRepository.getRoleById(data.idRol);
    if (!role) throw new InvalidRoleException();

    data.password = await hashPassword(data.password);

    const user = await this.userRepository.createUser(data);

    logger.info({ action: 'CREATE_USER', idUsuario: user.idUsuario, email: user.email });

    return user;
  }
}

module.exports = CreateUser;