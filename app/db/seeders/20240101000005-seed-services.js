/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "services",
      [
        {
          name: "Deep Cleaning Facial",
          description:
            "A thorough facial treatment to cleanse pores and remove impurities, leaving your skin refreshed and radiant.",
          duration_minutes: 60,
          price: 350000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Swedish Body Massage",
          description:
            "A classic relaxing massage to ease muscle tension and improve circulation.",
          duration_minutes: 90,
          price: 550000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Manicure & Pedicure",
          description:
            "Complete nail care for both hands and feet, including shaping, cuticle care, and polish.",
          duration_minutes: 75,
          price: 250000,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("services", null, {});
  },
};
