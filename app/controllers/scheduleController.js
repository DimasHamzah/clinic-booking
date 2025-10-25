const asyncHandler = require('../middleware/asyncHandler');

class ScheduleController {
  constructor({ scheduleService, sendSuccess }) {
    this.scheduleService = scheduleService;
    this.sendSuccess = sendSuccess;
  }

  createSchedule = asyncHandler(async (req, res) => {
    const schedule = await this.scheduleService.createSchedule(req.body);
    this.sendSuccess(res, 'Schedule created successfully', schedule, 201);
  });

  getAllSchedules = asyncHandler(async (req, res) => {
    const { rows, count } = await this.scheduleService.getAllSchedules(req.query);
    this.sendSuccess(res, 'Schedules retrieved successfully', { schedules: rows, total: count });
  });

  getScheduleById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const schedule = await this.scheduleService.getScheduleById(id);
    this.sendSuccess(res, 'Schedule retrieved successfully', schedule);
  });

  updateSchedule = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedSchedule = await this.scheduleService.updateSchedule(id, req.body);
    this.sendSuccess(res, 'Schedule updated successfully', updatedSchedule);
  });

  deleteSchedule = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.scheduleService.deleteSchedule(id);
    this.sendSuccess(res, 'Schedule deleted successfully', null, 204);
  });
}

module.exports = ScheduleController;
