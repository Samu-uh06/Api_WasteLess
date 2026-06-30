const { MenuNotFoundException, MenuCodeDuplicatedException, InvalidDiningRoomException, InvalidDateRangeException } = require('../../domain/exceptions/MenuExceptions');
const logger = require('../../../../../shared/utils/logger');

class UpdateMenu {
  constructor(menuRepository, diningRoomRepository) {
    this.menuRepository = menuRepository;
    this.diningRoomRepository = diningRoomRepository;
  }

  async execute(idMenu, data) {
    const existing = await this.menuRepository.getMenuById(idMenu);
    if (!existing) throw new MenuNotFoundException();

    if (data.codigo !== existing.codigo) {
      const codeExists = await this.menuRepository.findByCode(data.codigo);
      if (codeExists) throw new MenuCodeDuplicatedException();
    }

    const diningRoom = await this.diningRoomRepository.getDiningRoomById(data.idComedor);
    if (!diningRoom) throw new InvalidDiningRoomException();

    if (new Date(data.fechaInicio) >= new Date(data.fechaFin)) throw new InvalidDateRangeException();

    const updated = await this.menuRepository.updateMenu(idMenu, data);

    logger.info({ action: 'UPDATE_MENU', idMenu });

    return updated;
  }
}

module.exports = UpdateMenu;