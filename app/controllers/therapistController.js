const asyncHandler = require("../middleware/asyncHandler");

class TherapistController {
  constructor({ therapistService, sendSuccess }) {
    this.therapistService = therapistService;
    this.sendSuccess = sendSuccess;
  }

  createTherapist = asyncHandler(async (req, res) => {
    const therapist = await this.therapistService.createTherapist(req.body);
    this.sendSuccess(
      res,
      "Therapist profile created successfully",
      therapist,
      201,
    );
  });

  getAllTherapists = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.therapistService.getAllTherapists({
      limit,
      offset,
    });

    const responseData = {
      therapists: rows,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
    };

    this.sendSuccess(
      res,
      "Therapist profiles retrieved successfully",
      responseData,
    );
  });

  getTherapistById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const therapist = await this.therapistService.getTherapistById(
      parseInt(id, 10),
    );
    this.sendSuccess(
      res,
      "Therapist profile retrieved successfully",
      therapist,
    );
  });

  updateTherapist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedTherapist = await this.therapistService.updateTherapist(
      parseInt(id, 10),
      req.body,
    );
    this.sendSuccess(
      res,
      "Therapist profile updated successfully",
      updatedTherapist,
    );
  });

  deleteTherapist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.therapistService.deleteTherapist(parseInt(id, 10));
    this.sendSuccess(res, "Therapist profile deleted successfully", null, 204);
  });
}

module.exports = TherapistController;
