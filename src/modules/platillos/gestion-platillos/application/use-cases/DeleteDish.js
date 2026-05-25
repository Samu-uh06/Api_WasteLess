const { DishNotFoundException } = require('../../domain/exceptions/DishExceptions');
const { deleteImage } = require('../../infrastructure/database/cloudinary');
const logger = require('../../../../../shared/utils/logger');

class DeleteDish {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idPlatillo) {
    const dish = await this.dishRepository.getDishById(idPlatillo);
    if (!dish) throw new DishNotFoundException();

    if (dish.imagen) {
      try {
        const publicId = dish.imagen.split('/').slice(-2).join('/').split('.')[0];
        await deleteImage(publicId);
      } catch (err) {
        logger.error({ action: 'DELETE_IMAGE_ERROR', idPlatillo, error: err.message });
      }
    }

    await this.dishRepository.deleteDish(idPlatillo);

    logger.info({ action: 'DELETE_DISH', idPlatillo });
  }
}

module.exports = DeleteDish;