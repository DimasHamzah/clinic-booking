/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: _Sequelize.INTEGER,
      },
      username: {
        type: _Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: _Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: _Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: _Sequelize.STRING,
        allowNull: true,
      },
      displayName: {
        type: _Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: _Sequelize.ENUM("CUSTOMER", "STAFF", "ADMIN"),
        allowNull: false,
        defaultValue: "CUSTOMER",
      },
      createdAt: {
        allowNull: false,
        type: _Sequelize.DATE,
        defaultValue: _Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: _Sequelize.DATE,
        defaultValue: _Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable("users");
  },
};
