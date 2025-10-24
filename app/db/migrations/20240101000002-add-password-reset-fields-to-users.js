/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.addColumn("users", "passwordResetToken", {
      type: _Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "passwordResetExpires", {
      type: _Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn("users", "passwordResetToken");
    await queryInterface.removeColumn("users", "passwordResetExpires");
  },
};
