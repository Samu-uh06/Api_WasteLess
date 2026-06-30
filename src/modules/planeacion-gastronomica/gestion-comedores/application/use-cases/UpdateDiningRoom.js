const { DiningRoomNotFoundException, InvalidCompanyException, InvalidCapacityException } = require('../../domain/exceptions/DiningRoomExceptions');
const logger = require('../../../../../shared/utils/logger');

class UpdateDiningRoom {
  constructor(diningRoomRepository, companyRepository) {
    this.diningRoomRepository = diningRoomRepository;
    this.companyRepository = companyRepository;
  }

  async execute(idComedor, data) {
    const existing = await this.diningRoomRepository.getDiningRoomById(idComedor);
    if (!existing) throw new DiningRoomNotFoundException();

    if (data.capacidad <= 0) throw new InvalidCapacityException();

    if (data.idEmpresa) {
      const company = await this.companyRepository.getCompanyById(data.idEmpresa);
      if (!company) throw new InvalidCompanyException();
    }

    const updated = await this.diningRoomRepository.updateDiningRoom(idComedor, data);

    logger.info({ action: 'UPDATE_DINING_ROOM', idComedor });

    return updated;
  }
}

module.exports = UpdateDiningRoom;