const { DishNotFoundException } = require('../../domain/exceptions/DishExceptions');
const { deleteImage } = require('../../infrastructure/database/cloudinary');
const logger = require('../../../../../shared/utils/logger');

class RemoveDishImage {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idPlatillo) {
    const dish = await this.dishRepository.getDishById(idPlatillo);
    if (!dish) throw new DishNotFoundException();

    if (dish.imagen) {
      const publicId = dish.imagen.split('/').slice(-2).join('/').split('.')[0];
      await deleteImage(publicId);
    }

    await this.dishRepository.removeDishImage(idPlatillo);

    logger.info({ action: 'REMOVE_DISH_IMAGE', idPlatillo });

    return { message: 'Imagen eliminada correctamente' };
  }
}

module.exports = RemoveDishImage;