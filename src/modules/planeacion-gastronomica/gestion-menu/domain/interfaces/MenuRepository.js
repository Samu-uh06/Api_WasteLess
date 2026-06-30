class MenuRepository {
  async createMenu(data) { throw new Error('Not implemented'); }
  async updateMenu(idMenu, data) { throw new Error('Not implemented'); }
  async deleteMenu(idMenu) { throw new Error('Not implemented'); }
  async getMenuById(idMenu) { throw new Error('Not implemented'); }
  async getAllMenus({ page, limit, orderBy, orderDir, idComedor }) { throw new Error('Not implemented'); }
  async searchMenus({ search, idComedor, estado, page, limit }) { throw new Error('Not implemented'); }
  async changeMenuStatus(idMenu, estado) { throw new Error('Not implemented'); }
  async getMenuPlanning(idMenu) { throw new Error('Not implemented'); }
  async assignDishToMenu(idMenu, data) { throw new Error('Not implemented'); }
  async removeDishFromMenu(idDetalle) { throw new Error('Not implemented'); }
  async getMenuStatistics() { throw new Error('Not implemented'); }
  async findByCode(codigo) { throw new Error('Not implemented'); }
  async getDetailById(idDetalle) { throw new Error('Not implemented'); }
}

module.exports = MenuRepository;