const {
  OrderDetailNotFoundException,
  InvalidProductionStatusException,
} = require('../../domain/exceptions/OrderExceptions');

const VALID_STATUSES = ['pendiente', 'en_proceso', 'completado'];

class UpdateMealStatus {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(idDetalle, estadoProduccion) {
    if (!VALID_STATUSES.includes(estadoProduccion)) {
      throw new InvalidProductionStatusException();
    }

    const existing = await this.orderRepository.getOrderDetailById(idDetalle);
    if (!existing) throw new OrderDetailNotFoundException();

    return this.orderRepository.updateMealStatus(idDetalle, estadoProduccion);
  }
}

module.exports = UpdateMealStatus;