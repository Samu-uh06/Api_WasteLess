class GetDishes {
  constructor(dishRepository) {
    this.dishRepository = dishRepository;
  }

  async execute({ page, limit, orderBy, orderDir, idCategoria }) {
    return this.dishRepository.getAllDishes({ page, limit, orderBy, orderDir, idCategoria });
  }
}

module.exports = GetDishes;