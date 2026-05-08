const AppException = require('../../../../../shared/exceptions/AppException');

class UserNotFoundException extends AppException {
  constructor() {
    super('Usuario no encontrado', 404, 'USER_NOT_FOUND');
  }
}

class EmailDuplicatedException extends AppException {
  constructor() {
    super('El email ya está registrado', 409, 'EMAIL_DUPLICATED');
  }
}

class DocumentDuplicatedException extends AppException {
  constructor() {
    super('El número de documento ya está registrado', 409, 'DOCUMENT_DUPLICATED');
  }
}

class InvalidRoleException extends AppException {
  constructor() {
    super('El rol especificado no existe', 400, 'INVALID_ROLE');
  }
}

class UserInactiveException extends AppException {
  constructor() {
    super('El usuario está inactivo', 403, 'USER_INACTIVE');
  }
}

module.exports = {
  UserNotFoundException,
  EmailDuplicatedException,
  DocumentDuplicatedException,
  InvalidRoleException,
  UserInactiveException,
};