const { DishNotFoundException } = require('../../domain/exceptions/DishExceptions');
const logger = require('../../../../../shared/utils/logger');

class UploadDishImage {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute(idPlatillo, imageUrl) {
    const dish = await this.dishRepository.getDishById(idPlatillo);
    if (!dish) throw new DishNotFoundException();

    await this.dishRepository.updateDishImage(idPlatillo, imageUrl);

    logger.info({ action: 'UPLOAD_DISH_IMAGE', idPlatillo, imageUrl });

    return { message: 'Imagen subida correctamente', imagen: imageUrl };
  }
}

module.exports = UploadDishImage;