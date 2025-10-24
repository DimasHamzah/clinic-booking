class ServiceRepository {
  constructor({ serviceModel }) {
    this.serviceModel = serviceModel;
  }

  create(serviceData) {
    return this.serviceModel.create(serviceData);
  }

  findById(id, options = {}) {
    return this.serviceModel.findByPk(id, options);
  }

  findAll(options = {}) {
    return this.serviceModel.findAndCountAll(options);
  }

  async update(id, updateData) {
    const [affectedRows] = await this.serviceModel.update(updateData, {
      where: { id },
    });
    if (affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  }

  delete(id) {
    return this.serviceModel.destroy({ where: { id } });
  }
}

module.exports = ServiceRepository;
