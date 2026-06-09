const { CompanyNotFoundException, NitDuplicatedException, InvalidCityException, InvalidCompanyTypeException } = require('../../domain/exceptions/CompanyExceptions');
const logger = require('../../../../../shared/utils/logger');

class UpdateCompany {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute(idEmpresa, data) {
    const existing = await this.companyRepository.getCompanyById(idEmpresa);
    if (!existing) throw new CompanyNotFoundException();

    if (!['Jurídica', 'Natural'].includes(data.tipoEmpresa)) throw new InvalidCompanyTypeException();

    if (data.nit !== existing.nit) {
      const nitExists = await this.companyRepository.findByNit(data.nit);
      if (nitExists) throw new NitDuplicatedException();
    }

    if (data.idCiudad) {
      const city = await this.companyRepository.getCityById(data.idCiudad);
      if (!city) throw new InvalidCityException();
    }

    const updated = await this.companyRepository.updateCompany(idEmpresa, data);

    logger.info({ action: 'UPDATE_COMPANY', idEmpresa });

    return updated;
  }
}

module.exports = UpdateCompany;