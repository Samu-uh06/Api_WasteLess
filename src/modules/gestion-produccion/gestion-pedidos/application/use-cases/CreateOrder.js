const {
  CompanyNotFoundException,
  DiningRoomNotFoundException,
  MenuNotFoundException,
  DiningRoomDoesNotBelongToCompanyException,
  MenuDoesNotBelongToDiningRoomException,
  DuplicateOrderException,
} = require('../../domain/exceptions/OrderExceptions');

class CreateOrder {
  constructor(orderRepository, menuRepository) {
    this.orderRepository = orderRepository;
    this.menuRepository = menuRepository;
  }

  async execute(data) {
    const company = await this.orderRepository.getCompanyById(data.idEmpresa);
    if (!company) throw new CompanyNotFoundException();

    const diningRoom = await this.orderRepository.getDiningRoomById(data.idComedor);
    if (!diningRoom) throw new DiningRoomNotFoundException();

    if (parseInt(diningRoom.idEmpresa) !== parseInt(data.idEmpresa)) {
      throw new DiningRoomDoesNotBelongToCompanyException();
    }

    const menu = await this.orderRepository.getMenuById(data.idMenu);
    if (!menu) throw new MenuNotFoundException();

    if (parseInt(menu.idComedor) !== parseInt(data.idComedor)) {
      throw new MenuDoesNotBelongToDiningRoomException();
    }

    const existingOrder = await this.orderRepository.findExistingOrder(
      data.idMenu,
      data.idComedor,
      data.semana
    );
    if (existingOrder) throw new DuplicateOrderException();

    const order = await this.orderRepository.createOrder(data);

    const menuPlanning = await this.menuRepository.getMenuPlanning(data.idMenu);
    for (const item of menuPlanning) {
      await this.orderRepository.createOrderDetail({
        idPedido: order.idPedido,
        diaSemana: item.diaSemana,
        tipoComida: item.tipoComida,
        idPlatillo: item.idPlatillo,
      });
    }

    return order;
  }
}

module.exports = CreateOrder;