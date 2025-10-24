const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Service extends Model {
    static associate(_models) {
      // eslint-disable-line no-unused-vars
      // define association here if needed in the future
    }
  }

  Service.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Service name cannot be empty." },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Duration must be an integer." },
          min: { args: [1], msg: "Duration must be at least 1 minute." },
        },
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: { msg: "Price must be a decimal value." },
          min: { args: [0], msg: "Price cannot be negative." },
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Service",
      tableName: "services",
      timestamps: true,
    },
  );

  return Service;
};
