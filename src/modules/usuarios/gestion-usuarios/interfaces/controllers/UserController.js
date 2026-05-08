const CreateUser = require('../../application/use-cases/CreateUser');
const UpdateUser = require('../../application/use-cases/UpdateUser');
const DeleteUser = require('../../application/use-cases/DeleteUser');
const GetUserById = require('../../application/use-cases/GetUserById');
const GetUsers = require('../../application/use-cases/GetUsers');
const SearchUsers = require('../../application/use-cases/SearchUsers');
const ChangeUserStatus = require('../../application/use-cases/ChangeUserStatus');

const SqlUserRepository = require('../../infrastructure/repository/SqlUserRepository');
const SqlRoleRepository = require('../../../../configuracion/roles/infrastructure/repository/SqlRoleRepository');

const CreateUserDTO = require('../dtos/CreateUserDTO');
const UpdateUserDTO = require('../dtos/UpdateUserDTO');
const UserResponseDTO = require('../dtos/UserResponseDTO');
const AppException = require('../../../../../shared/exceptions/AppException');

const userRepo = new SqlUserRepository();
const roleRepo = new SqlRoleRepository();

class UserController {
  async create(req, res, next) {
    try {
      const { error, value } = CreateUserDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const user = await new CreateUser(userRepo, roleRepo).execute(value);
      res.status(201).json({ success: true, data: UserResponseDTO(user) });
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC' } = req.query;
      const result = await new GetUsers(userRepo).execute({ page: +page, limit: +limit, orderBy, orderDir });
      res.json({ success: true, ...result, data: result.data.map(UserResponseDTO) });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const user = await new GetUserById(userRepo).execute(+req.params.id);
      res.json({ success: true, data: UserResponseDTO(user) });
    } catch (err) { next(err); }
  }

  async search(req, res, next) {
    try {
      const { search = '', estado, idRol, page = 1, limit = 10 } = req.query;
      const result = await new SearchUsers(userRepo).execute({
        search, estado, idRol: idRol ? +idRol : null, page: +page, limit: +limit,
      });
      res.json({ success: true, ...result, data: result.data.map(UserResponseDTO) });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const { error, value } = UpdateUserDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const user = await new UpdateUser(userRepo).execute(+req.params.id, value);
      res.json({ success: true, data: UserResponseDTO(user) });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await new DeleteUser(userRepo).execute(+req.params.id);
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (err) { next(err); }
  }

  async changeStatus(req, res, next) {
    try {
      const { estado } = req.body;
      if (!['activo', 'inactivo'].includes(estado)) {
        throw new AppException('Estado inválido', 400, 'INVALID_STATUS');
      }
      const result = await new ChangeUserStatus(userRepo).execute(+req.params.id, estado);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async statistics(req, res, next) {
    try {
      const stats = await userRepo.getUsersStatistics();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }
}

module.exports = new UserController();