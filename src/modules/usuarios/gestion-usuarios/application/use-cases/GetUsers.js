class GetUsers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ page, limit, orderBy, orderDir }) {
    return this.userRepository.getAllUsers({ page, limit, orderBy, orderDir });
  }
}

module.exports = GetUsers;