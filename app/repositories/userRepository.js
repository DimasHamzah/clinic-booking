class UserRepository {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  async create(userData) {
    return await this.userModel.create(userData);
  }

  async findById(id) {
    return await this.userModel.findByPk(id);
  }

  async findByEmail(email) {
    return await this.userModel.findOne({ where: { email } });
  }

  async findByUsername(username) {
    return await this.userModel.findOne({ where: { username } });
  }

  async findOne(options) {
    return await this.userModel.findOne(options);
  }

  async findAll(options = {}) {
    return await this.userModel.findAndCountAll(options);
  }

  async update(id, updateData) {
    const [affectedRows] = await this.userModel.update(updateData, { where: { id }, returning: true });
    if (affectedRows > 0) {
        const updatedUser = await this.findById(id);
        return updatedUser;
    }
    return null;
  }

  async delete(id) {
    return await this.userModel.destroy({ where: { id } });
  }
}

module.exports = UserRepository;
