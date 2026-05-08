class SearchUsers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ search, estado, idRol, page, limit }) {
    return this.userRepository.searchUsers({ search, estado, idRol, page, limit });
  }
}

module.exports = SearchUsers;