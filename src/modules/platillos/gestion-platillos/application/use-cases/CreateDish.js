const { DishNameDuplicatedException, InvalidCategoryException } = require('../../domain/exceptions/DishExceptions');
const logger = require('../../../../../shared/utils/logger');

class CreateDish {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(data) {
    const existing = await this.dishRepository.findByName(data.nombre);
    if (existing) throw new DishNameDuplicatedException();

    const category = await this.dishRepository.getCategoryById(data.idCategoria);
    if (!category) throw new InvalidCategoryException();

    const dish = await this.dishRepository.createDish(data);

    logger.info({ action: 'CREATE_DISH', idPlatillo: dish.idPlatillo, nombre: dish.nombre });

    return dish;
  }
}

module.exports = CreateDish;