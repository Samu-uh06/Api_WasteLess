class GetCompanies {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute({ page, limit, orderBy, orderDir, tipoEmpresa }) {
    return this.companyRepository.getAllCompanies({ page, limit, orderBy, orderDir, tipoEmpresa });
  }
}

module.exports = GetCompanies;