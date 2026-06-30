const { MenuCodeDuplicatedException, InvalidDiningRoomException, InvalidDateRangeException } = require('../../domain/exceptions/MenuExceptions');
const logger = require('../../../../../shared/utils/logger');

class CreateMenu {
  constructor(menuRepository, diningRoomRepository) {
    this.menuRepository = menuRepository;
    this.diningRoomRepository = diningRoomRepository;
  }

  async execute(data) {
    const codeExists = await this.menuRepository.findByCode(data.codigo);
    if (codeExists) throw new MenuCodeDuplicatedException();

    const diningRoom = await this.diningRoomRepository.getDiningRoomById(data.idComedor);
    if (!diningRoom) throw new InvalidDiningRoomException();

    if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) throw new InvalidDateRangeException();

    const menu = await this.menuRepository.createMenu(data);

    logger.info({ action: 'CREATE_MENU', idMenu: menu.idMenu, codigo: menu.codigo });

    return menu;
  }
}

module.exports = CreateMenu;