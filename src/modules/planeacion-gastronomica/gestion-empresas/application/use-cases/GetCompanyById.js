const { CompanyNotFoundException } = require('../../domain/exceptions/CompanyExceptions');

class GetCompanyById {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(idEmpresa) {
    const company = await this.companyRepository.getCompanyById(idEmpresa);
    if (!company) throw new CompanyNotFoundException();
    return company;
  }
}

module.exports = GetCompanyById;