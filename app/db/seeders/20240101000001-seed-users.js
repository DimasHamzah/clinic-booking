const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    // eslint-disable-line no-unused-vars
    const hashedPasswordAdmin = await bcrypt.hash("adminpassword", 10);
    const hashedPasswordStaff = await bcrypt.hash("staffpassword", 10);
    const hashedPasswordCustomer = await bcrypt.hash("customerpassword", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "adminuser",
          email: "admin@example.com",
          password: hashedPasswordAdmin,
          phoneNumber: "081234567890",
          displayName: "Admin User",
          role: "ADMIN",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "staffuser",
          email: "staff@example.com",
          password: hashedPasswordStaff,
          phoneNumber: "081234567891",
          displayName: "Staff User",
          role: "STAFF",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "customeruser",
          email: "customer@example.com",
          password: hashedPasswordCustomer,
          phoneNumber: "081234567892",
          displayName: "Customer User",
          role: "CUSTOMER",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, _Sequelize) {
    // eslint-disable-line no-unused-vars
    await queryInterface.bulkDelete("users", null, {});
  },
};
