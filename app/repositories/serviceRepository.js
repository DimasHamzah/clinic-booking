class ServiceRepository {
  constructor({ serviceModel }) {
    this.serviceModel = serviceModel;
  }

  async create(serviceData) {
    return await this.serviceModel.create(serviceData);
  }

  async findById(id, options = {}) {
    return await this.serviceModel.findByPk(id, options);
  }

  async findAll(options = {}) {
    return await this.serviceModel.findAndCountAll(options);
  }

  async update(id, updateData) {
    const [affectedRows] = await this.serviceModel.update(updateData, { where: { id } });
    if (affectedRows > 0) {
      return await this.findById(id);
    }
    return null;
  }

  async delete(id) {
    return await this.serviceModel.destroy({ where: { id } });
  }
}

module.exports = ServiceRepository;
