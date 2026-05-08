const { UserNotFoundException } = require('../../domain/exceptions/UserExceptions');

class GetUserById {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(idUsuario) {
    const user = await this.userRepository.getUserById(idUsuario);
    if (!user) throw new UserNotFoundException();
    return user;
  }
}

module.exports = GetUserById;