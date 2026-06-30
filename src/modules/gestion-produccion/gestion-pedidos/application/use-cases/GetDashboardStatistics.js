class GetDashboardStatistics {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute() {
    return this.orderRepository.getOrderStatistics();
  }
}

module.exports = GetDashboardStatistics;