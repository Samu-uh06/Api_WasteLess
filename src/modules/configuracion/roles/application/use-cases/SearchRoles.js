class SearchRoles {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute({ search, estado, page, limit }) {
    return this.roleRepository.searchRoles({ search, estado, page, limit });
  }
}

module.exports = SearchRoles;