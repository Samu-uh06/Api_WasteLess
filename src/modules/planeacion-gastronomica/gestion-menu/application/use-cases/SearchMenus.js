class SearchMenus {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute({ search, idComedor, estado, page, limit }) {
    return this.menuRepository.searchMenus({ search, idComedor, estado, page, limit });
  }
}

module.exports = SearchMenus;