const {
  DayNotCompletedException,
  ProductionOrderAlreadyExistsException,
} = require('../../domain/exceptions/ProductionOrderExceptions');

class CreateProductionOrder {
  constructor(productionOrderRepository) {
    this.repo = productionOrderRepository;
  }

  async execute({ idPedido, diaSemana }) {
    const meals = await this.repo.getMealsByDay(idPedido, diaSemana);
    const allCompleted = meals.length > 0 && meals.every(m => m.estadoProduccion === 'completado');
    if (!allCompleted) throw new DayNotCompletedException();

    const existing = await this.repo.findByPedidoAndDay(idPedido, diaSemana);
    if (existing) throw new ProductionOrderAlreadyExistsException();

    const codigo = await this.repo.generateCodigo();

    return this.repo.create({ idPedido, diaSemana, codigo });
  }
}

module.exports = CreateProductionOrder;