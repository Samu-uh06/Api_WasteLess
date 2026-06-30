class GetProductionOrders {
  constructor(productionOrderRepository) {
    this.repo = productionOrderRepository;
  }

  async execute() {
    return this.repo.findAll();
  }
}

module.exports = GetProductionOrders;