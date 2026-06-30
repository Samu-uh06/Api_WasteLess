const { InvalidCompanyException, InvalidCapacityException } = require('../../domain/exceptions/DiningRoomExceptions');
const logger = require('../../../../../shared/utils/logger');

class CreateDiningRoom {
  constructor(diningRoomRepository, companyRepository) {
    this.diningRoomRepository = diningRoomRepository;
    this.companyRepository = companyRepository;
  }

  async execute(data) {
    if (data.capacidad <= 0) throw new InvalidCapacityException();

    const company = await this.companyRepository.getCompanyById(data.idEmpresa);
    if (!company) throw new InvalidCompanyException();

    const diningRoom = await this.diningRoomRepository.createDiningRoom(data);

    logger.info({ action: 'CREATE_DINING_ROOM', idComedor: diningRoom.idComedor, nombre: diningRoom.nombre });

    return diningRoom;
  }
}

module.exports = CreateDiningRoom;