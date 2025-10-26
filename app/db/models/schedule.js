const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Therapist, {
        foreignKey: "therapistId",
        as: "therapist",
        onDelete: "CASCADE",
      });
    }
  }

  Schedule.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      therapistId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "therapists",
          key: "id",
        },
      },
      availableDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Schedule",
      tableName: "schedules",
      timestamps: true,
    },
  );

  return Schedule;
};
