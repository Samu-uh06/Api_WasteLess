const { CategoryNameDuplicatedException } = require('../../domain/exceptions/DishExceptions');
const logger = require('../../../../../shared/utils/logger');

class CreateCategory {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute({ nombre, descripcion }) {
    const existing = await this.dishRepository.findCategoryByName(nombre);
    if (existing) throw new CategoryNameDuplicatedException();

    const category = await this.dishRepository.createCategory({ nombre, descripcion });

    logger.info({ action: 'CREATE_CATEGORY', idCategoria: category.idCategoria, nombre });

    return category;
  }
}

module.exports = CreateCategory;