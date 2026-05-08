const jwt = require('jsonwebtoken');
const { TokenInvalidException } = require('../../domain/exceptions/AuthExceptions');

class RefreshToken {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ refreshToken }) {
    const session = await this.authRepository.findSessionByRefreshToken(refreshToken);
    if (!session || !session.isActive()) throw new TokenInvalidException();

    const permisos = await this.authRepository.getUserPermissions(session.idUsuario);

    const newToken = jwt.sign(
      { idUsuario: session.idUsuario, permissions: permisos },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return { token: newToken };
  }
}

module.exports = RefreshToken;