const { DiningRoomNotFoundException, DiningRoomHasDependenciesException } = require('../../domain/exceptions/DiningRoomExceptions');
const logger = require('../../../../../shared/utils/logger');

class DeleteDiningRoom {
  constructor(diningRoomRepository) {
    this.diningRoomRepository = diningRoomRepository;
  }

  async execute(idComedor) {
    const diningRoom = await this.diningRoomRepository.getDiningRoomById(idComedor);
    if (!diningRoom) throw new DiningRoomNotFoundException();

    const hasDependencies = await this.diningRoomRepository.hasDependencies(idComedor);
    if (hasDependencies) throw new DiningRoomHasDependenciesException();

    await this.diningRoomRepository.deleteDiningRoom(idComedor);

    logger.info({ action: 'DELETE_DINING_ROOM', idComedor });
  }
}

module.exports = DeleteDiningRoom;