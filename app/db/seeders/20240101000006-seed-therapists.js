/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Find the users who will be therapists
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role IN ('STAFF', 'ADMIN')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (users.length < 2) {
      console.log(
        "Could not find enough staff/admin users to seed therapists. Please run the user seeder first.",
      );
      return;
    }

    const [staffUser, adminUser] = users;

    await queryInterface.bulkInsert(
      "therapists",
      [
        {
          userId: staffUser.id,
          specialization: "Facial Treatments & Skin Care",
          rating: 4.8,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: adminUser.id, // Let's make the admin a therapist too
          specialization: "Massage Therapy & Aromatherapy",
          rating: 4.9,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("therapists", null, {});
  },
};
