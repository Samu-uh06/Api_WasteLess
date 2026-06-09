const { CompanyNotFoundException } = require('../../domain/exceptions/CompanyExceptions');
const logger = require('../../../../../shared/utils/logger');

class DeleteCompany {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(idEmpresa) {
    const company = await this.companyRepository.getCompanyById(idEmpresa);
    if (!company) throw new CompanyNotFoundException();

    await this.companyRepository.deleteCompany(idEmpresa);

    logger.info({ action: 'DELETE_COMPANY', idEmpresa });
  }
}

module.exports = DeleteCompany;