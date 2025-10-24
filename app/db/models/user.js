const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

module.exports = (sequelize) => {
  class User extends Model {
    validatePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    getResetPasswordToken() {
      const resetToken = crypto.randomBytes(20).toString("hex");
      this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      return resetToken;
    }

    static associate(models) {
      User.hasOne(models.Therapist, {
        foreignKey: "userId",
        as: "therapistProfile",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "unique_username",
          msg: "Username already exists.",
        },
        validate: {
          notNull: { msg: "Username is required." },
          notEmpty: { msg: "Username cannot be empty." },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: "unique_email",
          msg: "Email already in use.",
        },
        validate: {
          notNull: { msg: "Email is required." },
          isEmail: { msg: "Invalid email format." },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Password is required." },
          len: {
            args: [8, 255],
            msg: "Password must be at least 8 characters long.",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Display name is required." },
        },
      },
      role: {
        type: DataTypes.ENUM("CUSTOMER", "STAFF", "ADMIN"),
        allowNull: false,
        defaultValue: "CUSTOMER",
        validate: {
          isIn: {
            args: [["CUSTOMER", "STAFF", "ADMIN"]],
            msg: "Invalid role specified.",
          },
        },
      },
      passwordResetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            // eslint-disable-next-line no-param-reassign
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            // eslint-disable-next-line no-param-reassign
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    },
  );

  return User;
};
