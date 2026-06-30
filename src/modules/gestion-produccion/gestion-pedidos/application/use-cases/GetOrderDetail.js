const { OrderNotFoundException } = require('../../domain/exceptions/OrderExceptions');

class GetOrderDetail {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(idPedido) {
    const order = await this.orderRepository.getOrderById(idPedido);
    if (!order) throw new OrderNotFoundException();

    const planning = await this.orderRepository.getWeeklyPlanning(idPedido);

    const groupedPlanning = {};
    planning.forEach((item) => {
      if (!groupedPlanning[item.diaSemana]) groupedPlanning[item.diaSemana] = {};
      if (!groupedPlanning[item.diaSemana][item.tipoComida]) groupedPlanning[item.diaSemana][item.tipoComida] = [];
      groupedPlanning[item.diaSemana][item.tipoComida].push(item);
    });

    return { order, planning: groupedPlanning };
  }
}

module.exports = GetOrderDetail;