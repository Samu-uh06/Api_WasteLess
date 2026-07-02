class GetDashboardStatistics {
  constructor(orderRepository, productionOrderRepository) {
    this.orderRepository = orderRepository;
    this.productionOrderRepository = productionOrderRepository;
  }

  async execute() {
    const [orderStats, ordenesProduccionHoy] = await Promise.all([
      this.orderRepository.getOrderStatistics(),
      this.productionOrderRepository.getTodayOrders(),
    ]);

    return { ...orderStats, ordenesProduccionHoy };
  }
}

module.exports = GetDashboardStatistics;