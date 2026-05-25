const { DishNotFoundException } = require('../../domain/exceptions/DishExceptions');
const logger = require('../../../../../shared/utils/logger');

class ChangeDishStatus {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idPlatillo, estado) {
    const dish = await this.dishRepository.getDishById(idPlatillo);
    if (!dish) throw new DishNotFoundException();

    await this.dishRepository.changeDishStatus(idPlatillo, estado);

    logger.info({ action: 'CHANGE_DISH_STATUS', idPlatillo, estado });

    return { message: `Platillo ${estado} correctamente` };
  }
}

module.exports = ChangeDishStatus;