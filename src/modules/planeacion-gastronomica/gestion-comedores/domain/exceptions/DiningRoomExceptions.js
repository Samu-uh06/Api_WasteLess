const AppException = require('../../../../../shared/exceptions/AppException');

class DiningRoomNotFoundException extends AppException {
  constructor() {
    super('Comedor no encontrado', 404, 'DINING_ROOM_NOT_FOUND');
  }
}

class InvalidCompanyException extends AppException {
  constructor() {
    super('La empresa especificada no existe', 400, 'INVALID_COMPANY');
  }
}

class InvalidCapacityException extends AppException {
  constructor() {
    super('La capacidad debe ser mayor a cero', 400, 'INVALID_CAPACITY');
  }
}

class DiningRoomHasDependenciesException extends AppException {
  constructor() {
    super('No se puede eliminar el comedor porque tiene menús o pedidos asociados', 400, 'DINING_ROOM_HAS_DEPENDENCIES');
  }
}

module.exports = {
  DiningRoomNotFoundException,
  InvalidCompanyException,
  InvalidCapacityException,
  DiningRoomHasDependenciesException,
};