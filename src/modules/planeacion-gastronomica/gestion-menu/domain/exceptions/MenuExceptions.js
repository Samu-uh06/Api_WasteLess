const AppException = require('../../../../../shared/exceptions/AppException');

class MenuNotFoundException extends AppException {
  constructor() {
    super('Menú no encontrado', 404, 'MENU_NOT_FOUND');
  }
}

class MenuCodeDuplicatedException extends AppException {
  constructor() {
    super('Ya existe un menú con ese código', 409, 'MENU_CODE_DUPLICATED');
  }
}

class InvalidDiningRoomException extends AppException {
  constructor() {
    super('El comedor especificado no existe', 400, 'INVALID_DINING_ROOM');
  }
}

class InvalidDateRangeException extends AppException {
  constructor() {
    super('La fecha de inicio debe ser menor a la fecha fin', 400, 'INVALID_DATE_RANGE');
  }
}

class InvalidDishException extends AppException {
  constructor() {
    super('El platillo especificado no existe', 400, 'INVALID_DISH');
  }
}

class MenuDetailNotFoundException extends AppException {
  constructor() {
    super('Detalle de menú no encontrado', 404, 'MENU_DETAIL_NOT_FOUND');
  }
}

class InvalidDayException extends AppException {
  constructor() {
    super('El día debe ser Lunes, Martes, Miércoles, Jueves, Viernes o Sábado', 400, 'INVALID_DAY');
  }
}

class InvalidMealTypeException extends AppException {
  constructor() {
    super('El tipo de comida debe ser Desayuno, Almuerzo o Media tarde', 400, 'INVALID_MEAL_TYPE');
  }
}

module.exports = {
  MenuNotFoundException,
  MenuCodeDuplicatedException,
  InvalidDiningRoomException,
  InvalidDateRangeException,
  InvalidDishException,
  MenuDetailNotFoundException,
  InvalidDayException,
  InvalidMealTypeException,
};