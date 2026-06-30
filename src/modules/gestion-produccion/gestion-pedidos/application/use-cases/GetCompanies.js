class GetCompanies {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute() {
    return this.orderRepository.getCompanies();
  }
}

module.exports = GetCompanies;