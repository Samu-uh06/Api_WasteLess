const CreateCompany = require('../../application/use-cases/CreateCompany');
const UpdateCompany = require('../../application/use-cases/UpdateCompany');
const DeleteCompany = require('../../application/use-cases/DeleteCompany');
const GetCompanyById = require('../../application/use-cases/GetCompanyById');
const GetCompanies = require('../../application/use-cases/GetCompanies');
const SearchCompanies = require('../../application/use-cases/SearchCompanies');
const ChangeCompanyStatus = require('../../application/use-cases/ChangeCompanyStatus');
const GetCompanyIndicators = require('../../application/use-cases/GetCompanyIndicators');

const SqlCompanyRepository = require('../../infrastructure/repository/SqlCompanyRepository');
const CreateCompanyDTO = require('../dtos/CreateCompanyDTO');
const UpdateCompanyDTO = require('../dtos/UpdateCompanyDTO');
const CompanyResponseDTO = require('../dtos/CompanyResponseDTO');
const AppException = require('../../../../../shared/exceptions/AppException');

const repo = new SqlCompanyRepository();

class CompanyController {
  async create(req, res, next) {
    try {
      const { error, value } = CreateCompanyDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const company = await new CreateCompany(repo).execute(value);
      res.status(201).json({ success: true, data: CompanyResponseDTO(company) });
    } catch (err) { next(err); }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, orderBy = 'fechaRegistro', orderDir = 'DESC', tipoEmpresa } = req.query;
      const result = await new GetCompanies(repo).execute({ page: +page, limit: +limit, orderBy, orderDir, tipoEmpresa });
      res.json({ success: true, ...result, data: result.data.map(CompanyResponseDTO) });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const company = await new GetCompanyById(repo).execute(+req.params.id);
      res.json({ success: true, data: CompanyResponseDTO(company) });
    } catch (err) { next(err); }
  }

  async search(req, res, next) {
    try {
      const { search = '', tipoEmpresa, estado, page = 1, limit = 10 } = req.query;
      const result = await new SearchCompanies(repo).execute({ search, tipoEmpresa, estado, page: +page, limit: +limit });
      res.json({ success: true, ...result, data: result.data.map(CompanyResponseDTO) });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const { error, value } = UpdateCompanyDTO.validate(req.body);
      if (error) throw new AppException(error.details[0].message, 400, 'VALIDATION_ERROR');

      const company = await new UpdateCompany(repo).execute(+req.params.id, value);
      res.json({ success: true, data: CompanyResponseDTO(company) });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await new DeleteCompany(repo).execute(+req.params.id);
      res.json({ success: true, message: 'Empresa eliminada correctamente' });
    } catch (err) { next(err); }
  }

  async changeStatus(req, res, next) {
    try {
      const { estado } = req.body;
      if (!['activo', 'inactivo'].includes(estado)) {
        throw new AppException('Estado inválido', 400, 'INVALID_STATUS');
      }
      const result = await new ChangeCompanyStatus(repo).execute(+req.params.id, estado);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async statistics(req, res, next) {
    try {
      const stats = await repo.getCompanyStatistics();
      res.json({ success: true, data: stats });
    } catch (err) { next(err); }
  }

  async indicators(req, res, next) {
    try {
      const indicators = await new GetCompanyIndicators(repo).execute(+req.params.id);
      res.json({ success: true, data: indicators });
    } catch (err) { next(err); }
  }

  async getCities(req, res, next) {
    try {
      const cities = await repo.getAllCities();
      res.json({ success: true, data: cities });
    } catch (err) { next(err); }
  }
}

module.exports = new CompanyController();