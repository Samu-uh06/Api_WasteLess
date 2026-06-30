class DayNotCompletedException extends Error {
  constructor() {
    super('No todas las comidas del día están en estado completado');
    this.statusCode = 400;
    this.code = 'DAY_NOT_COMPLETED';
  }
}

class ProductionOrderAlreadyExistsException extends Error {
  constructor() {
    super('Ya existe una orden de producción para ese día del pedido');
    this.statusCode = 409;
    this.code = 'PRODUCTION_ORDER_ALREADY_EXISTS';
  }
}

class ProductionOrderNotFoundException extends Error {
  constructor() {
    super('La orden de producción no existe');
    this.statusCode = 404;
    this.code = 'PRODUCTION_ORDER_NOT_FOUND';
  }
}

module.exports = {
  DayNotCompletedException,
  ProductionOrderAlreadyExistsException,
  ProductionOrderNotFoundException,
};