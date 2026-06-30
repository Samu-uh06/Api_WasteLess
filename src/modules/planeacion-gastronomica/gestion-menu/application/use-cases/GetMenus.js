class GetMenus {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute({ page, limit, orderBy, orderDir, idComedor }) {
    return this.menuRepository.getAllMenus({ page, limit, orderBy, orderDir, idComedor });
  }
}

module.exports = GetMenus;