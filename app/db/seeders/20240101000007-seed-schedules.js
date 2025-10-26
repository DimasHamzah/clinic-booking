/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    // Find the therapists to create schedules for
    const therapists = await queryInterface.sequelize.query(
      "SELECT id FROM therapists LIMIT 2",
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (therapists.length === 0) {
      // eslint-disable-next-line no-console
      console.log(
        "Could not find any therapists to seed schedules. Please run the therapist seeder first.",
      );
      return;
    }

    const schedules = [];
    const today = new Date();

    therapists.forEach((therapist, index) => {
      // Create 3 schedules for each therapist for the next 3 days
      for (let i = 1; i <= 3; i += 1) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + i + index); // Stagger the dates a bit

        schedules.push({
          therapistId: therapist.id,
          availableDate: scheduleDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
          startTime: "09:00:00",
          endTime: "17:00:00",
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    await queryInterface.bulkInsert("schedules", schedules, {});
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete("schedules", null, {});
  },
};
