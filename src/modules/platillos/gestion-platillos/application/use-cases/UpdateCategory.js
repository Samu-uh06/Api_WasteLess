const { CategoryNotFoundException, CategoryNameDuplicatedException } = require('../../domain/exceptions/DishExceptions');
const logger = require('../../../../../shared/utils/logger');

class UpdateCategory {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idCategoria, { nombre, descripcion }) {
    const existing = await this.dishRepository.getCategoryById(idCategoria);
    if (!existing) throw new CategoryNotFoundException();

    if (nombre !== existing.nombre) {
      const nameTaken = await this.dishRepository.findCategoryByName(nombre);
      if (nameTaken) throw new CategoryNameDuplicatedException();
    }

    const updated = await this.dishRepository.updateCategory(idCategoria, { nombre, descripcion });

    logger.info({ action: 'UPDATE_CATEGORY', idCategoria });

    return updated;
  }
}

module.exports = UpdateCategory;