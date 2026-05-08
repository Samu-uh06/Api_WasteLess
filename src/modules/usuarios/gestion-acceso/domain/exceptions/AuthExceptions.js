const AppException = require('../../../../../shared/exceptions/AppException');

class InvalidCredentialsException extends AppException {
  constructor() {
    super('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
  }
}

class UserInactiveException extends AppException {
  constructor() {
    super('El usuario está inactivo', 403, 'USER_INACTIVE');
  }
}

class TokenInvalidException extends AppException {
  constructor() {
    super('Token inválido o expirado', 401, 'TOKEN_INVALID');
  }
}

class EmailNotFoundException extends AppException {
  constructor() {
    super('El email no está registrado', 404, 'EMAIL_NOT_FOUND');
  }
}

class RecoveryTokenExpiredException extends AppException {
  constructor() {
    super('El enlace de recuperación ha expirado', 400, 'RECOVERY_TOKEN_EXPIRED');
  }
}

module.exports = {
  InvalidCredentialsException,
  UserInactiveException,
  TokenInvalidException,
  EmailNotFoundException,
  RecoveryTokenExpiredException,
};