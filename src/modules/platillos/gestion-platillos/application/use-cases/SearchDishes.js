class SearchDishes {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute({ search, idCategoria, estado, page, limit }) {
    return this.dishRepository.searchDishes({ search, idCategoria, estado, page, limit });
  }
}

module.exports = SearchDishes;