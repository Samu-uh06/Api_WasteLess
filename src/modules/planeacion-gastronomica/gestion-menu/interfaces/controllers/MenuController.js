const CreateMenu = require('../../application/use-cases/CreateMenu');
const UpdateMenu = require('../../application/use-cases/UpdateMenu');
const DeleteMenu = require('../../application/use-cases/DeleteMenu');
const GetMenuById = require('../../application/use-cases/GetMenuById');
const GetMenus = require('../../application/use-cases/GetMenus');
const SearchMenus = require('../../application/use-cases/SearchMenus');
const ChangeMenuStatus = require('../../application/use-cases/ChangeMenuStatus');
const AssignDishToMenu = require('../../application/use-cases/AssignDishToMenu');
const RemoveDishFromMenu = require('../../application/use-cases/RemoveDishFromMenu');
const GetMenuPlanning = require('../../application/use-cases/GetMenuPlanning');

const SqlMenuRepository = require('../../infrastructure/repository/SqlMenuRepository');
const SqlDiningRoomRepository = require('../../../gestion-comedores/infrastructure/repository/SqlDiningRoomRepository');
const SqlDishRepository = require('../../../../platillos/gestion-platillos/infrastructure/repository/SqlDishRepository');

const CreateMenuDTO = require('../dtos/CreateMenuDTO');
const UpdateMenuDTO = require('../dtos/UpdateMenuDTO');
const MenuDetailDTO = require('../dtos/MenuDetailDTO');
const MenuResponseDTO = require('../dtos/MenuResponseDTO');
const AppException = require('../../../../../shared/exceptions/AppException');

const repo = new SqlMenuRepository();
const diningRoomRepo = new SqlDiningRoomRepository();
const dishRepo = new SqlDishRepository();

class MenuController {
  async create(req, res, next) {
    try {
      const { error, value } = CreateMenuDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const menu = await new CreateMenu(repo, diningRoomRepo).execute(value);
      res.status(201).json({ success: true, data: MenuResponseDTO(menu) });
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC', idComedor } = req.query;
      const result = await new GetMenus(repo).execute({
        page: +page, limit: +limit, orderBy, orderDir,
        idComedor: idComedor ? +idComedor : null,
      });
      res.json({ success: true, ...result, data: result.data.map(MenuResponseDTO) });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const menu = await new GetMenuById(repo).execute(+req.params.id);
      res.json({ success: true, data: MenuResponseDTO(menu) });
    } catch (err) { next(err); }
  }

  async search(req, res, next) {
    try {
      const { search = '', idComedor, estado, page = 1, limit = 10 } = req.query;
      const result = await new SearchMenus(repo).execute({
        search, idComedor: idComedor ? +idComedor : null,
        estado, page: +page, limit: +limit,
      });
      res.json({ success: true, ...result, data: result.data.map(MenuResponseDTO) });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const { error, value } = UpdateMenuDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const menu = await new UpdateMenu(repo, diningRoomRepo).execute(+req.params.id, value);
      res.json({ success: true, data: MenuResponseDTO(menu) });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await new DeleteMenu(repo).execute(+req.params.id);
      res.json({ success: true, message: 'Menú eliminado correctamente' });
    } catch (err) { next(err); }
  }

  async changeStatus(req, res, next) {
    try {
      const { estado } = req.body;
      if (!['activo', 'inactivo'].includes(estado)) {
        throw new AppException('Estado inválido', 400, 'INVALID_STATUS');
      }
      const result = await new ChangeMenuStatus(repo).execute(+req.params.id, estado);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async getPlanning(req, res, next) {
    try {
      const result = await new GetMenuPlanning(repo).execute(+req.params.id);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async assignDish(req, res, next) {
    try {
      const { error, value } = MenuDetailDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const detail = await new AssignDishToMenu(repo, dishRepo).execute(+req.params.id, value);
      res.status(201).json({ success: true, data: detail });
    } catch (err) { next(err); }
  }

  async removeDish(req, res, next) {
    try {
      await new RemoveDishFromMenu(repo).execute(+req.params.detailId);
      res.json({ success: true, message: 'Platillo eliminado del menú correctamente' });
    } catch (err) { next(err); }
  }

  async statistics(req, res, next) {
    try {
      const stats = await repo.getMenuStatistics();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }
}

module.exports = new MenuController();