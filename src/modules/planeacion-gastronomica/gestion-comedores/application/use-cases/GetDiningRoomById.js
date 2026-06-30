const { DiningRoomNotFoundException } = require('../../domain/exceptions/DiningRoomExceptions');

class GetDiningRoomById {
  constructor(diningRoomRepository) {
    this.diningRoomRepository = diningRoomRepository;
  }

  async execute(idComedor) {
    const diningRoom = await this.diningRoomRepository.getDiningRoomById(idComedor);
    if (!diningRoom) throw new DiningRoomNotFoundException();
    return diningRoom;
  }
}

module.exports = GetDiningRoomById;