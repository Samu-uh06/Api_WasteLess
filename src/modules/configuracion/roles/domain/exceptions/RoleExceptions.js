const AppException = require('../../../../../shared/exceptions/AppException');

class RoleNotFoundException extends AppException {
  constructor() {
    super('Rol no encontrado', 404, 'ROLE_NOT_FOUND');
  }
}

class RoleNameDuplicatedException extends AppException {
  constructor() {
    super('Ya existe un rol con ese nombre', 409, 'ROLE_NAME_DUPLICATED');
  }
}

class RoleHasUsersException extends AppException {
  constructor() {
    super('No se puede eliminar el rol porque tiene usuarios asociados', 400, 'ROLE_HAS_USERS');
  }
}

class InvalidPermissionsException extends AppException {
  constructor() {
    super('Uno o más permisos enviados no son válidos', 400, 'INVALID_PERMISSIONS');
  }
}

module.exports = {
  RoleNotFoundException,
  RoleNameDuplicatedException,
  RoleHasUsersException,
  InvalidPermissionsException,
};