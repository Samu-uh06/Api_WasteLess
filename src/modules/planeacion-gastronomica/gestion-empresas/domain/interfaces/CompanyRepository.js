class CompanyRepository {
  async createCompany(data) { throw new Error('Not implemented'); }
  async updateCompany(idEmpresa, data) { throw new Error('Not implemented'); }
  async deleteCompany(idEmpresa) { throw new Error('Not implemented'); }
  async getCompanyById(idEmpresa) { throw new Error('Not implemented'); }
  async getAllCompanies({ page, limit, orderBy, orderDir, tipoEmpresa }) { throw new Error('Not implemented'); }
  async searchCompanies({ search, tipoEmpresa, estado, page, limit }) { throw new Error('Not implemented'); }
  async changeCompanyStatus(idEmpresa, estado) { throw new Error('Not implemented'); }
  async getCompanyStatistics() { throw new Error('Not implemented'); }
  async getCompanyIndicators(idEmpresa) { throw new Error('Not implemented'); }
  async findByNit(nit) { throw new Error('Not implemented'); }
  async getAllCities() { throw new Error('Not implemented'); }
  async getCityById(idCiudad) { throw new Error('Not implemented'); }
}

module.exports = CompanyRepository;