class OrderNotFoundException extends Error {
  constructor() {
    super('El pedido especificado no existe');
    this.statusCode = 404;
    this.code = 'ORDER_NOT_FOUND';
  }
}

class CompanyNotFoundException extends Error {
  constructor() {
    super('La empresa especificada no existe');
    this.statusCode = 404;
    this.code = 'COMPANY_NOT_FOUND';
  }
}

class DiningRoomNotFoundException extends Error {
  constructor() {
    super('El comedor especificado no existe');
    this.statusCode = 404;
    this.code = 'DINING_ROOM_NOT_FOUND';
  }
}

class WeekNotFoundException extends Error {
  constructor() {
    super('La semana especificada no existe');
    this.statusCode = 404;
    this.code = 'WEEK_NOT_FOUND';
  }
}

class MenuNotFoundException extends Error {
  constructor() {
    super('El menú especificado no existe');
    this.statusCode = 404;
    this.code = 'MENU_NOT_FOUND';
  }
}

class OrderDetailNotFoundException extends Error {
  constructor() {
    super('La comida especificada no existe en este pedido');
    this.statusCode = 404;
    this.code = 'ORDER_DETAIL_NOT_FOUND';
  }
}

class InvalidOrderStatusException extends Error {
  constructor() {
    super('Estado de pedido inválido');
    this.statusCode = 400;
    this.code = 'INVALID_ORDER_STATUS';
  }
}

class InvalidProductionStatusException extends Error {
  constructor() {
    super('Estado de producción inválido');
    this.statusCode = 400;
    this.code = 'INVALID_PRODUCTION_STATUS';
  }
}

class InvalidMealTypeException extends Error {
  constructor() {
    super('Tipo de comida inválido');
    this.statusCode = 400;
    this.code = 'INVALID_MEAL_TYPE';
  }
}

class InvalidDayOfWeekException extends Error {
  constructor() {
    super('Día de la semana inválido');
    this.statusCode = 400;
    this.code = 'INVALID_DAY_OF_WEEK';
  }
}

class OrderWithoutDishesException extends Error {
  constructor() {
    super('El pedido debe tener al menos un platillo');
    this.statusCode = 400;
    this.code = 'ORDER_WITHOUT_DISHES';
  }
}

class DiningRoomDoesNotBelongToCompanyException extends Error {
  constructor() {
    super('El comedor no pertenece a la empresa indicada');
    this.statusCode = 400;
    this.code = 'DINING_ROOM_COMPANY_MISMATCH';
  }
}

class MenuDoesNotBelongToDiningRoomException extends Error {
  constructor() {
    super('El menú no pertenece al comedor indicado');
    this.statusCode = 400;
    this.code = 'MENU_DINING_ROOM_MISMATCH';
  }
}

class DuplicateOrderException extends Error {
  constructor() {
    super('Ya existe un pedido para ese menú, comedor y semana');
    this.statusCode = 409;
    this.code = 'DUPLICATE_ORDER';
  }
}

module.exports = {
  OrderNotFoundException,
  CompanyNotFoundException,
  DiningRoomNotFoundException,
  WeekNotFoundException,
  MenuNotFoundException,
  OrderDetailNotFoundException,
  InvalidOrderStatusException,
  InvalidProductionStatusException,
  InvalidMealTypeException,
  InvalidDayOfWeekException,
  OrderWithoutDishesException,
  DiningRoomDoesNotBelongToCompanyException,
  MenuDoesNotBelongToDiningRoomException,
  DuplicateOrderException,
};