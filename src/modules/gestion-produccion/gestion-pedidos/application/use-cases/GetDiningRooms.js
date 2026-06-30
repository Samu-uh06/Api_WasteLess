const { CompanyNotFoundException } = require('../../domain/exceptions/OrderExceptions');

class GetDiningRooms {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(idEmpresa) {
    const company = await this.orderRepository.getCompanyById(idEmpresa);
    if (!company) throw new CompanyNotFoundException();

    return this.orderRepository.getDiningRoomsByCompany(idEmpresa);
  }
}

module.exports = GetDiningRooms;