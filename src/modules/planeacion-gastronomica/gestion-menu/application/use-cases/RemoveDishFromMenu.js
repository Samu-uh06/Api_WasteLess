const { MenuDetailNotFoundException } = require('../../domain/exceptions/MenuExceptions');
const logger = require('../../../../../shared/utils/logger');

class RemoveDishFromMenu {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute(idDetalle) {
    const detail = await this.menuRepository.getDetailById(idDetalle);
    if (!detail) throw new MenuDetailNotFoundException();

    await this.menuRepository.removeDishFromMenu(idDetalle);

    logger.info({ action: 'REMOVE_DISH_FROM_MENU', idDetalle });
  }
}

module.exports = RemoveDishFromMenu;