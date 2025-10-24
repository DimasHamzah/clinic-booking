const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Therapist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A therapist profile belongs to a single user
      Therapist.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE", // If a user is deleted, their therapist profile is also deleted
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
        unique: true, // Enforces the one-to-one relationship
        references: {
          model: "users", // table name
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
      timestamps: true, // Adds createdAt and updatedAt
    },
  );

  return Therapist;
};
