const { DishNotFoundException, DishNameDuplicatedException, InvalidCategoryException } = require('../../domain/exceptions/DishExceptions');
const logger = require('../../../../../shared/utils/logger');

class UpdateDish {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idPlatillo, data) {
    const existing = await this.dishRepository.getDishById(idPlatillo);
    if (!existing) throw new DishNotFoundException();

    if (data.nombre !== existing.nombre) {
      const nameTaken = await this.dishRepository.findByName(data.nombre);
      if (nameTaken) throw new DishNameDuplicatedException();
    }

    if (data.idCategoria) {
      const category = await this.dishRepository.getCategoryById(data.idCategoria);
      if (!category) throw new InvalidCategoryException();
    }

    const updated = await this.dishRepository.updateDish(idPlatillo, data);

    logger.info({ action: 'UPDATE_DISH', idPlatillo });

    return updated;
  }
}

module.exports = UpdateDish;