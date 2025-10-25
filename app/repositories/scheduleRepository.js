class ScheduleRepository {
  constructor({ scheduleModel }) {
    this.scheduleModel = scheduleModel;
  }

  create(scheduleData) {
    return this.scheduleModel.create(scheduleData);
  }

  findById(id, options = {}) {
    return this.scheduleModel.findByPk(id, options);
  }

  findAll(options = {}) {
    return this.scheduleModel.findAndCountAll(options);
  }

  update(id, updateData) {
    return this.scheduleModel.update(updateData, { where: { id } });
  }

  delete(id) {
    return this.scheduleModel.destroy({ where: { id } });
  }
}

module.exports = ScheduleRepository;
