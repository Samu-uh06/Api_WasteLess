const { CompanyNotFoundException } = require('../../domain/exceptions/CompanyExceptions');
const logger = require('../../../../../shared/utils/logger');

class ChangeCompanyStatus {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(idEmpresa, estado) {
    const company = await this.companyRepository.getCompanyById(idEmpresa);
    if (!company) throw new CompanyNotFoundException();

    await this.companyRepository.changeCompanyStatus(idEmpresa, estado);

    logger.info({ action: 'CHANGE_COMPANY_STATUS', idEmpresa, estado });

    return { message: `Empresa ${estado} correctamente` };
  }
}

module.exports = ChangeCompanyStatus;