class UserRepository {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  create(userData) {
    return this.userModel.create(userData);
  }

  findById(id) {
    return this.userModel.findByPk(id);
  }

  findByEmail(email) {
    return this.userModel.findOne({ where: { email } });
  }

  findByUsername(username) {
    return this.userModel.findOne({ where: { username } });
  }

  findOne(options) {
    return this.userModel.findOne(options);
  }

  findAll(options = {}) {
    return this.userModel.findAndCountAll(options);
  }

  async update(id, updateData) {
    const [affectedRows] = await this.userModel.update(updateData, {
      where: { id },
    });
    if (affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  }

  delete(id) {
    return this.userModel.destroy({ where: { id } });
  }
}

module.exports = UserRepository;
