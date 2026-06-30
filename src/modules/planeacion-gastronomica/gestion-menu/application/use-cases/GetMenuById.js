const { MenuNotFoundException } = require('../../domain/exceptions/MenuExceptions');

class GetMenuById {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute(idMenu) {
    const menu = await this.menuRepository.getMenuById(idMenu);
    if (!menu) throw new MenuNotFoundException();
    return menu;
  }
}

module.exports = GetMenuById;