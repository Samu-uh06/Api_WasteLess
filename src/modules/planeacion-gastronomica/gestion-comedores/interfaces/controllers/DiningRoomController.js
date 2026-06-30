const CreateDiningRoom = require('../../application/use-cases/CreateDiningRoom');
const UpdateDiningRoom = require('../../application/use-cases/UpdateDiningRoom');
const DeleteDiningRoom = require('../../application/use-cases/DeleteDiningRoom');
const GetDiningRoomById = require('../../application/use-cases/GetDiningRoomById');
const GetDiningRooms = require('../../application/use-cases/GetDiningRooms');
const SearchDiningRooms = require('../../application/use-cases/SearchDiningRooms');
const ChangeDiningRoomStatus = require('../../application/use-cases/ChangeDiningRoomStatus');

const SqlDiningRoomRepository = require('../../infrastructure/repository/SqlDiningRoomRepository');
const SqlCompanyRepository = require('../../../gestion-empresas/infrastructure/repository/SqlCompanyRepository');

const CreateDiningRoomDTO = require('../dtos/CreateDiningRoomDTO');
const UpdateDiningRoomDTO = require('../dtos/UpdateDiningRoomDTO');
const DiningRoomResponseDTO = require('../dtos/DiningRoomResponseDTO');
const AppException = require('../../../../../shared/exceptions/AppException');

const repo = new SqlDiningRoomRepository();
const companyRepo = new SqlCompanyRepository();

class DiningRoomController {
  async create(req, res, next) {
    try {
      const { error, value } = CreateDiningRoomDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const diningRoom = await new CreateDiningRoom(repo, companyRepo).execute(value);
      res.status(201).json({ success: true, data: DiningRoomResponseDTO(diningRoom) });
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC', idEmpresa } = req.query;
      const result = await new GetDiningRooms(repo).execute({
        page: +page, limit: +limit, orderBy, orderDir,
        idEmpresa: idEmpresa ? +idEmpresa : null,
      });
      res.json({ success: true, ...result, data: result.data.map(DiningRoomResponseDTO) });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const diningRoom = await new GetDiningRoomById(repo).execute(+req.params.id);
      res.json({ success: true, data: DiningRoomResponseDTO(diningRoom) });
    } catch (err) { next(err); }
  }

  async search(req, res, next) {
    try {
      const { search = '', idEmpresa, estado, page = 1, limit = 10 } = req.query;
      const result = await new SearchDiningRooms(repo).execute({
        search, idEmpresa: idEmpresa ? +idEmpresa : null,
        estado, page: +page, limit: +limit,
      });
      res.json({ success: true, ...result, data: result.data.map(DiningRoomResponseDTO) });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const { error, value } = UpdateDiningRoomDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const diningRoom = await new UpdateDiningRoom(repo, companyRepo).execute(+req.params.id, value);
      res.json({ success: true, data: DiningRoomResponseDTO(diningRoom) });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await new DeleteDiningRoom(repo).execute(+req.params.id);
      res.json({ success: true, message: 'Comedor eliminado correctamente' });
    } catch (err) { next(err); }
  }

  async changeStatus(req, res, next) {
    try {
      const { estado } = req.body;
      if (!['activo', 'inactivo'].includes(estado)) {
        throw new AppException('Estado inválido', 400, 'INVALID_STATUS');
      }
      const result = await new ChangeDiningRoomStatus(repo).execute(+req.params.id, estado);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async statistics(req, res, next) {
    try {
      const stats = await repo.getDiningRoomStatistics();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }
}

module.exports = new DiningRoomController();