class GetDiningRooms {
  constructor(diningRoomRepository) {
    this.diningRoomRepository = diningRoomRepository;
  }

  async execute({ page, limit, orderBy, orderDir, idEmpresa }) {
    return this.diningRoomRepository.getAllDiningRooms({ page, limit, orderBy, orderDir, idEmpresa });
  }
}

module.exports = GetDiningRooms;