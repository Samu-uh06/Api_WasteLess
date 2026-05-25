const { CategoryNotFoundException } = require('../../domain/exceptions/DishExceptions');
const logger = require('../../../../../shared/utils/logger');

class DeleteCategory {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idCategoria) {
    const existing = await this.dishRepository.getCategoryById(idCategoria);
    if (!existing) throw new CategoryNotFoundException();

    await this.dishRepository.deleteCategory(idCategoria);

    logger.info({ action: 'DELETE_CATEGORY', idCategoria });
  }
}

module.exports = DeleteCategory;