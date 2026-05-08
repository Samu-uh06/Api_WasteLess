const crypto = require('crypto');
const { EmailNotFoundException } = require('../../domain/exceptions/AuthExceptions');
const { sendRecoveryEmail } = require('../../../../../shared/utils/mailer');
const logger = require('../../../../../shared/utils/logger');

class RecoverPassword {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ email }) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new EmailNotFoundException();

    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.authRepository.saveRecoveryToken(user.idUsuario, token, expiracion);
    await sendRecoveryEmail(email, token);

    logger.info({ action: 'RECOVER_PASSWORD', idUsuario: user.idUsuario, email });

    return { message: 'Correo de recuperación enviado' };
  }
}

module.exports = RecoverPassword;