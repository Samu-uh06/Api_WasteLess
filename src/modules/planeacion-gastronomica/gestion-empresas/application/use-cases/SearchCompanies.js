class SearchCompanies {
  constructor(companyRepository) {
    this.companyRepository = companyRepository;
  }

  async execute({ search, tipoEmpresa, estado, page, limit }) {
    return this.companyRepository.searchCompanies({ search, tipoEmpresa, estado, page, limit });
  }
}

module.exports = SearchCompanies;