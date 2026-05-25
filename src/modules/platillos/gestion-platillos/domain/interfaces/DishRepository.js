class DishRepository {
  async createDish(data) { throw new Error('Not implemented'); }
  async updateDish(idPlatillo, data) { throw new Error('Not implemented'); }
  async deleteDish(idPlatillo) { throw new Error('Not implemented'); }
  async getDishById(idPlatillo) { throw new Error('Not implemented'); }
  async getAllDishes({ page, limit, orderBy, orderDir, idCategoria }) { throw new Error('Not implemented'); }
  async searchDishes({ search, idCategoria, estado, page, limit }) { throw new Error('Not implemented'); }
  async changeDishStatus(idPlatillo, estado) { throw new Error('Not implemented'); }
  async updateDishImage(idPlatillo, imagen) { throw new Error('Not implemented'); }
  async removeDishImage(idPlatillo) { throw new Error('Not implemented'); }
  async getDishStatistics() { throw new Error('Not implemented'); }
  async findByName(nombre) { throw new Error('Not implemented'); }
  async createCategory(data) { throw new Error('Not implemented'); }
  async updateCategory(idCategoria, data) { throw new Error('Not implemented'); }
  async deleteCategory(idCategoria) { throw new Error('Not implemented'); }
  async getCategoryById(idCategoria) { throw new Error('Not implemented'); }
  async getAllCategories() { throw new Error('Not implemented'); }
  async findCategoryByName(nombre) { throw new Error('Not implemented'); }
}

module.exports = DishRepository;