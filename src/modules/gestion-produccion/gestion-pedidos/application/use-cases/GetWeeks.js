const { DiningRoomNotFoundException } = require('../../domain/exceptions/OrderExceptions');

class GetWeeks {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(idComedor) {
    const diningRoom = await this.orderRepository.getDiningRoomById(idComedor);
    if (!diningRoom) throw new DiningRoomNotFoundException();

    return this.orderRepository.getWeeksByDiningRoom(idComedor);
  }
}

module.exports = GetWeeks;