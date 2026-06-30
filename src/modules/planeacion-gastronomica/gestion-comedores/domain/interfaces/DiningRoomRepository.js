class DiningRoomRepository {
  async createDiningRoom(data) { throw new Error('Not implemented'); }
  async updateDiningRoom(idComedor, data) { throw new Error('Not implemented'); }
  async deleteDiningRoom(idComedor) { throw new Error('Not implemented'); }
  async getDiningRoomById(idComedor) { throw new Error('Not implemented'); }
  async getAllDiningRooms({ page, limit, orderBy, orderDir, idEmpresa }) { throw new Error('Not implemented'); }
  async searchDiningRooms({ search, idEmpresa, estado, page, limit }) { throw new Error('Not implemented'); }
  async changeDiningRoomStatus(idComedor, estado) { throw new Error('Not implemented'); }
  async getDiningRoomStatistics() { throw new Error('Not implemented'); }
  async findByNameAndCompany(nombre, idEmpresa) { throw new Error('Not implemented'); }
  async hasDependencies(idComedor) { throw new Error('Not implemented'); }
}

module.exports = DiningRoomRepository;