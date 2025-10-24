class TherapistRepository {
  constructor({ therapistModel }) {
    this.therapistModel = therapistModel;
  }

  create(therapistData) {
    return this.therapistModel.create(therapistData);
  }

  findById(id, options = {}) {
    return this.therapistModel.findByPk(id, options);
  }

  findByUserId(userId) {
    return this.therapistModel.findOne({ where: { userId } });
  }

  findAll(options = {}) {
    return this.therapistModel.findAndCountAll(options);
  }

  async update(id, updateData) {
    const [affectedRows] = await this.therapistModel.update(updateData, {
      where: { id },
    });
    if (affectedRows > 0) {
      return this.findById(id);
    }
    return null;
  }

  delete(id) {
    return this.therapistModel.destroy({ where: { id } });
  }
}

module.exports = TherapistRepository;
