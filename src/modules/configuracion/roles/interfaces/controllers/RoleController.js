const CreateRole = require('../../application/use-cases/CreateRole');
const UpdateRole = require('../../application/use-cases/UpdateRole');
const DeleteRole = require('../../application/use-cases/DeleteRole');
const GetRoleById = require('../../application/use-cases/GetRoleById');
const SearchRoles = require('../../application/use-cases/SearchRoles');
const ChangeRoleStatus = require('../../application/use-cases/ChangeRoleStatus');
const AssignPermissions = require('../../application/use-cases/AssignPermissions');

const SqlRoleRepository = require('../../infrastructure/repository/SqlRoleRepository');
const CreateRoleDTO = require('../dtos/CreateRoleDTO');
const UpdateRoleDTO = require('../dtos/UpdateRoleDTO');
const RoleResponseDTO = require('../dtos/RoleResponseDTO');
const AppException = require('../../../../../shared/exceptions/AppException');

const repo = new SqlRoleRepository();

class RoleController {
  async create(req, res, next) {
    try {
      const { error, value } = CreateRoleDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const role = await new CreateRole(repo).execute(value);
      res.status(201).json({ success: true, data: RoleResponseDTO(role) });
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, orderBy = 'fechaCreacion', orderDir = 'DESC' } = req.query;
      const result = await repo.getAllRoles({ page: +page, limit: +limit, orderBy, orderDir });
      res.json({ success: true, ...result, data: result.data.map(RoleResponseDTO) });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const role = await new GetRoleById(repo).execute(+req.params.id);
      res.json({ success: true, data: RoleResponseDTO(role) });
    } catch (err) { next(err); }
  }

  async search(req, res, next) {
    try {
      const { search = '', estado, page = 1, limit = 10 } = req.query;
      const result = await new SearchRoles(repo).execute({ search, estado, page: +page, limit: +limit });
      res.json({ success: true, ...result, data: result.data.map(RoleResponseDTO) });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const { error, value } = UpdateRoleDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const role = await new UpdateRole(repo).execute(+req.params.id, value);
      res.json({ success: true, data: RoleResponseDTO(role) });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await new DeleteRole(repo).execute(+req.params.id);
      res.json({ success: true, message: 'Rol eliminado correctamente' });
    } catch (err) { next(err); }
  }

  async changeStatus(req, res, next) {
    try {
      const { estado } = req.body;
      if (!['activo', 'inactivo'].includes(estado)) {
        throw new AppException('Estado inválido', 400, 'INVALID_STATUS');
      }
      const result = await new ChangeRoleStatus(repo).execute(+req.params.id, estado);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async assignPermissions(req, res, next) {
    try {
      const { permisos } = req.body;
      if (!Array.isArray(permisos)) {
        throw new AppException('Los permisos deben ser un arreglo', 400, 'VALIDATION_ERROR');
      }
      const result = await new AssignPermissions(repo).execute(+req.params.id, permisos);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async statistics(req, res, next) {
    try {
      const stats = await repo.getRolesStatistics();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }
}

module.exports = new RoleController();