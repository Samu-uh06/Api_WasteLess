const { NitDuplicatedException, InvalidCityException, InvalidCompanyTypeException } = require('../../domain/exceptions/CompanyExceptions');
const logger = require('../../../../../shared/utils/logger');

class CreateCompany {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(data) {
    if (!['Jurídica', 'Natural'].includes(data.tipoEmpresa)) throw new InvalidCompanyTypeException();

    const nitExists = await this.companyRepository.findByNit(data.nit);
    if (nitExists) throw new NitDuplicatedException();

    const city = await this.companyRepository.getCityById(data.idCiudad);
    if (!city) throw new InvalidCityException();

    const company = await this.companyRepository.createCompany(data);

    logger.info({ action: 'CREATE_COMPANY', idEmpresa: company.idEmpresa, nit: company.nit });

    return company;
  }
}

module.exports = CreateCompany;