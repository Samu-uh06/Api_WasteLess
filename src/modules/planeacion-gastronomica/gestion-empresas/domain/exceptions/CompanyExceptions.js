const AppException = require('../../../../../shared/exceptions/AppException');

class CompanyNotFoundException extends AppException {
  constructor() {
    super('Empresa no encontrada', 404, 'COMPANY_NOT_FOUND');
  }
}

class NitDuplicatedException extends AppException {
  constructor() {
    super('Ya existe una empresa con ese NIT', 409, 'NIT_DUPLICATED');
  }
}

class InvalidCityException extends AppException {
  constructor() {
    super('La ciudad especificada no existe', 400, 'INVALID_CITY');
  }
}

class InvalidCompanyTypeException extends AppException {
  constructor() {
    super('El tipo de empresa debe ser Jurídica o Natural', 400, 'INVALID_COMPANY_TYPE');
  }
}

module.exports = {
  CompanyNotFoundException,
  NitDuplicatedException,
  InvalidCityException,
  InvalidCompanyTypeException,
};