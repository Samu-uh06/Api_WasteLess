const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { comparePassword } = require('../../../../../shared/utils/bcrypt');
const { InvalidCredentialsException, UserInactiveException } = require('../../domain/exceptions/AuthExceptions');
const logger = require('../../../../../shared/utils/logger');

class LoginUser {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ email, password, ip, dispositivo }) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialsException();

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new InvalidCredentialsException();

    if (!user.isActive()) throw new UserInactiveException();

    const permisos = await this.authRepository.getUserPermissions(user.idUsuario);

    const token = jwt.sign(
      { idUsuario: user.idUsuario, email: user.email, idRol: user.idRol, permissions: permisos },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const fechaExpiracion = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    const session = await this.authRepository.saveSession({
      idUsuario: user.idUsuario, token, refreshToken, fechaExpiracion, ip, dispositivo,
    });

    logger.info({ action: 'LOGIN', idUsuario: user.idUsuario, email, ip });

    return { token, refreshToken, user: { idUsuario: user.idUsuario, email: user.email, idRol: user.idRol, permisos } };
  }
}

module.exports = LoginUser;