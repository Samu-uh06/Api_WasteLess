const { DiningRoomNotFoundException } = require('../../domain/exceptions/DiningRoomExceptions');
const logger = require('../../../../../shared/utils/logger');

class ChangeDiningRoomStatus {
  constructor(diningRoomRepository) {
    this.diningRoomRepository = diningRoomRepository;
  }

  async execute(idComedor, estado) {
    const diningRoom = await this.diningRoomRepository.getDiningRoomById(idComedor);
    if (!diningRoom) throw new DiningRoomNotFoundException();

    await this.diningRoomRepository.changeDiningRoomStatus(idComedor, estado);

    logger.info({ action: 'CHANGE_DINING_ROOM_STATUS', idComedor, estado });

    return { message: `Comedor ${estado} correctamente` };
  }
}

module.exports = ChangeDiningRoomStatus;