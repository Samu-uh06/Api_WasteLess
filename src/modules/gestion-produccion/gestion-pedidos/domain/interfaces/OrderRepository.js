class OrderRepository {
  async getCompanies() { throw new Error('Not implemented'); }
  async getDiningRoomsByCompany(idEmpresa) { throw new Error('Not implemented'); }
  async getWeeksByDiningRoom(idComedor) { throw new Error('Not implemented'); }
  async getOrderDetail(idPedido) { throw new Error('Not implemented'); }
  async updateMealStatus(idDetalle, estadoProduccion) { throw new Error('Not implemented'); }
  async updateOrderStatus(idPedido, estado) { throw new Error('Not implemented'); }
  async getOrderStatistics() { throw new Error('Not implemented'); }
  async getWeeklyPlanning(idPedido) { throw new Error('Not implemented'); }
  async getMealsByDay(idPedido, diaSemana) { throw new Error('Not implemented'); }
  async getOrderById(idPedido) { throw new Error('Not implemented'); }
  async getOrderDetailById(idDetalle) { throw new Error('Not implemented'); }
}

module.exports = OrderRepository;