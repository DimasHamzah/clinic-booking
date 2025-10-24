/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.createTable("therapists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: _Sequelize.INTEGER,
      },
      userId: {
        type: _Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Enforces the one-to-one relationship
        references: {
          model: "users", // name of the target table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE", // If a user is deleted, their therapist profile is also deleted
      },
      specialization: {
        type: _Sequelize.STRING,
        allowNull: false,
      },
      rating: {
        type: _Sequelize.FLOAT,
        allowNull: true,
      },
      isActive: {
        type: _Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    await queryInterface.dropTable("therapists");
  },
};
