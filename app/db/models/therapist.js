const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Therapist extends Model {
    static associate(models) {
      // A therapist profile belongs to a single user
      Therapist.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });

      // A therapist can have many schedules
      Therapist.hasMany(models.Schedule, {
        foreignKey: "therapistId",
        as: "schedules",
      });
    }
  }

  Therapist.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Specialization cannot be empty." },
        },
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          isFloat: true,
          min: 0,
          max: 5,
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
      modelName: "Therapist",
      tableName: "therapists",
      timestamps: true,
    },
  );

  return Therapist;
};
