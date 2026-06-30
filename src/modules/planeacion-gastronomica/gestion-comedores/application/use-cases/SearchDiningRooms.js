class SearchDiningRooms {
  constructor(diningRoomRepository) {
    this.diningRoomRepository = diningRoomRepository;
  }

  async execute({ search, idEmpresa, estado, page, limit }) {
    return this.diningRoomRepository.searchDiningRooms({ search, idEmpresa, estado, page, limit });
  }
}

module.exports = SearchDiningRooms;