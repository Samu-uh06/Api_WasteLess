const { DishNotFoundException } = require('../../domain/exceptions/DishExceptions');

class GetDishById {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idPlatillo) {
    const dish = await this.dishRepository.getDishById(idPlatillo);
    if (!dish) throw new DishNotFoundException();
    return dish;
  }
}

module.exports = GetDishById;