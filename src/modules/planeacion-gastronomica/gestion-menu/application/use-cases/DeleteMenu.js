const { MenuNotFoundException } = require('../../domain/exceptions/MenuExceptions');
const logger = require('../../../../../shared/utils/logger');

class DeleteMenu {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute(idMenu) {
    const menu = await this.menuRepository.getMenuById(idMenu);
    if (!menu) throw new MenuNotFoundException();

    await this.menuRepository.deleteMenu(idMenu);

    logger.info({ action: 'DELETE_MENU', idMenu });
  }
}

module.exports = DeleteMenu;