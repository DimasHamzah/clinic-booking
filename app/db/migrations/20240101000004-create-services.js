'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) { // eslint-disable-line no-unused-vars
    await queryInterface.createTable('services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: _Sequelize.INTEGER,
      },
      name: {
        type: _Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: _Sequelize.TEXT,
        allowNull: false,
      },
      duration_minutes: {
        type: _Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: _Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      isActive: {
        type: _Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: _Sequelize.DATE,
        defaultValue: _Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: _Sequelize.DATE,
        defaultValue: _Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, _Sequelize) { // eslint-disable-line no-unused-vars
    await queryInterface.dropTable('services');
  },
};
