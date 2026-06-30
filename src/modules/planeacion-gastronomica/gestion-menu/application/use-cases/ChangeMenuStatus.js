const { MenuNotFoundException } = require('../../domain/exceptions/MenuExceptions');
const logger = require('../../../../../shared/utils/logger');

class ChangeMenuStatus {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute(idMenu, estado) {
    const menu = await this.menuRepository.getMenuById(idMenu);
    if (!menu) throw new MenuNotFoundException();

    await this.menuRepository.changeMenuStatus(idMenu, estado);

    logger.info({ action: 'CHANGE_MENU_STATUS', idMenu, estado });

    return { message: `Menú ${estado} correctamente` };
  }
}

module.exports = ChangeMenuStatus;