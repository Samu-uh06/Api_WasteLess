const { hashPassword } = require('../../../../../shared/utils/bcrypt');
const { TokenInvalidException, RecoveryTokenExpiredException } = require('../../domain/exceptions/AuthExceptions');
const logger = require('../../../../../shared/utils/logger');

class ResetPassword {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ token, newPassword }) {
    const record = await this.authRepository.findRecoveryToken(token);
    if (!record) throw new TokenInvalidException();
    if (new Date() > new Date(record.fechaExpiracion)) throw new RecoveryTokenExpiredException();

    const hashed = await hashPassword(newPassword);
    await this.authRepository.updatePassword(record.idUsuario, hashed);
    await this.authRepository.invalidateRecoveryToken(token);

    logger.info({ action: 'RESET_PASSWORD', idUsuario: record.idUsuario });

    return { message: 'Contraseña actualizada correctamente' };
  }
}

module.exports = ResetPassword;