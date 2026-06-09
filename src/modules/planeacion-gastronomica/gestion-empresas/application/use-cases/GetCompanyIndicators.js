const { CompanyNotFoundException } = require('../../domain/exceptions/CompanyExceptions');

class GetCompanyIndicators {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(idEmpresa) {
    const company = await this.companyRepository.getCompanyById(idEmpresa);
    if (!company) throw new CompanyNotFoundException();

    const indicators = await this.companyRepository.getCompanyIndicators(idEmpresa);

    return indicators;
  }
}

module.exports = GetCompanyIndicators;