const CreateDish = require('../../application/use-cases/CreateDish');
const UpdateDish = require('../../application/use-cases/UpdateDish');
const DeleteDish = require('../../application/use-cases/DeleteDish');
const GetDishById = require('../../application/use-cases/GetDishById');
const GetDishes = require('../../application/use-cases/GetDishes');
const SearchDishes = require('../../application/use-cases/SearchDishes');
const ChangeDishStatus = require('../../application/use-cases/ChangeDishStatus');
const UploadDishImage = require('../../application/use-cases/UploadDishImage');
const RemoveDishImage = require('../../application/use-cases/RemoveDishImage');
const CreateCategory = require('../../application/use-cases/CreateCategory');
const UpdateCategory = require('../../application/use-cases/UpdateCategory');
const DeleteCategory = require('../../application/use-cases/DeleteCategory');

const SqlDishRepository = require('../../infrastructure/repository/SqlDishRepository');
const CreateDishDTO = require('../dtos/CreateDishDTO');
const UpdateDishDTO = require('../dtos/UpdateDishDTO');
const CategoryDTO = require('../dtos/CategoryDTO');
const DishResponseDTO = require('../dtos/DishResponseDTO');
const AppException = require('../../../../../shared/exceptions/AppException');

const repo = new SqlDishRepository();

class DishController {
  // ==================== CATEGORIAS ====================
  async createCategory(req, res, next) {
    try {
      const { error, value } = CategoryDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const category = await new CreateCategory(repo).execute(value);
      res.status(201).json({ success: true, data: category });
    } catch (err) { next(err); }
  }

  async getAllCategories(req, res, next) {
    try {
      const categories = await repo.getAllCategories();
      res.json({ success: true, data: categories });
    } catch (err) { next(err); }
  }

  async updateCategory(req, res, next) {
    try {
      const { error, value } = CategoryDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const category = await new UpdateCategory(repo).execute(+req.params.id, value);
      res.json({ success: true, data: category });
    } catch (err) { next(err); }
  }

  async deleteCategory(req, res, next) {
    try {
      await new DeleteCategory(repo).execute(+req.params.id);
      res.json({ success: true, message: 'Categoría eliminada correctamente' });
    } catch (err) { next(err); }
  }

  // ==================== PLATILLOS ====================
  async create(req, res, next) {
    try {
      const { error, value } = CreateDishDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      if (req.file) value.imagen = req.file.path;

      const dish = await new CreateDish(repo).execute(value);
      res.status(201).json({ success: true, data: DishResponseDTO(dish) });
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC', idCategoria } = req.query;
      const result = await new GetDishes(repo).execute({
        page: +page, limit: +limit, orderBy, orderDir,
        idCategoria: idCategoria ? +idCategoria : null,
      });
      res.json({ success: true, ...result, data: result.data.map(DishResponseDTO) });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const dish = await new GetDishById(repo).execute(+req.params.id);
      res.json({ success: true, data: DishResponseDTO(dish) });
    } catch (err) { next(err); }
  }

  async search(req, res, next) {
    try {
      const { search = '', idCategoria, estado, page = 1, limit = 10 } = req.query;
      const result = await new SearchDishes(repo).execute({
        search, idCategoria: idCategoria ? +idCategoria : null,
        estado, page: +page, limit: +limit,
      });
      res.json({ success: true, ...result, data: result.data.map(DishResponseDTO) });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const { error, value } = UpdateDishDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const dish = await new UpdateDish(repo).execute(+req.params.id, value);
      res.json({ success: true, data: DishResponseDTO(dish) });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await new DeleteDish(repo).execute(+req.params.id);
      res.json({ success: true, message: 'Platillo eliminado correctamente' });
    } catch (err) { next(err); }
  }

  async changeStatus(req, res, next) {
    try {
      const { estado } = req.body;
      if (!['activo', 'inactivo'].includes(estado)) {
        throw new AppException('Estado inválido', 400, 'INVALID_STATUS');
      }
      const result = await new ChangeDishStatus(repo).execute(+req.params.id, estado);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async uploadImage(req, res, next) {
    try {
      if (!req.file) throw new AppException('No se envió ninguna imagen', 400, 'NO_IMAGE');
      const result = await new UploadDishImage(repo).execute(+req.params.id, req.file.path);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async removeImage(req, res, next) {
    try {
      const result = await new RemoveDishImage(repo).execute(+req.params.id);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async statistics(req, res, next) {
    try {
      const stats = await repo.getDishStatistics();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }
}

module.exports = new DishController();