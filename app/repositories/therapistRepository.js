class TherapistRepository {
  constructor({ therapistModel }) {
    this.therapistModel = therapistModel;
  }

  /**
   * Creates a new therapist profile.
   * @param {object} therapistData - The data for the new therapist.
   * @returns {Promise<Therapist>} The created therapist instance.
   */
  async create(therapistData) {
    return await this.therapistModel.create(therapistData);
  }

  /**
   * Finds a therapist profile by its primary key.
   * @param {number} id - The ID of the therapist.
   * @param {object} [options] - Sequelize find options (e.g., include).
   * @returns {Promise<Therapist|null>} The found therapist instance or null.
   */
  async findById(id, options = {}) {
    return await this.therapistModel.findByPk(id, options);
  }

  /**
   * Finds a therapist profile by the associated user ID.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<Therapist|null>} The found therapist instance or null.
   */
  async findByUserId(userId) {
    return await this.therapistModel.findOne({ where: { userId } });
  }

  /**
   * Retrieves all therapist profiles with optional filtering and pagination.
   * @param {object} [options] - Sequelize findOptions (e.g., where, limit, offset, include).
   * @returns {Promise<{rows: Therapist[], count: number}>} An object with therapist rows and total count.
   */
  async findAll(options = {}) {
    return await this.therapistModel.findAndCountAll(options);
  }

  /**
   * Updates a therapist profile by its ID.
   * @param {number} id - The ID of the therapist to update.
   * @param {object} updateData - The data to update the therapist with.
   * @returns {Promise<Therapist|null>} The updated therapist instance or null.
   */
  async update(id, updateData) {
    const [affectedRows] = await this.therapistModel.update(updateData, { where: { id } });
    if (affectedRows > 0) {
      return await this.findById(id);
    }
    return null;
  }

  /**
   * Deletes a therapist profile by its ID.
   * @param {number} id - The ID of the therapist to delete.
   * @returns {Promise<number>} The number of deleted rows.
   */
  async delete(id) {
    return await this.therapistModel.destroy({ where: { id } });
  }
}

module.exports = TherapistRepository;
