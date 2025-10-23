const asyncHandler = require('../middleware/asyncHandler');

class ServiceController {
  constructor({ serviceService, sendSuccess }) {
    this.serviceService = serviceService;
    this.sendSuccess = sendSuccess;
  }

  createService = asyncHandler(async (req, res) => {
    const service = await this.serviceService.createService(req.body);
    this.sendSuccess(res, 'Service created successfully.', service, 201);
  });

  getAllServices = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.serviceService.getAllServices({ limit, offset });

    const responseData = {
      services: rows,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
    };

    this.sendSuccess(res, 'Services retrieved successfully.', responseData);
  });

  getServiceById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const service = await this.serviceService.getServiceById(parseInt(id, 10));

    if (!service) {
      const error = new Error('Service not found.');
      error.statusCode = 404;
      return next(error);
    }

    this.sendSuccess(res, 'Service retrieved successfully.', service);
  });

  updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedService = await this.serviceService.updateService(parseInt(id, 10), req.body);
    this.sendSuccess(res, 'Service updated successfully.', updatedService);
  });

  deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await this.serviceService.deleteService(parseInt(id, 10));
    this.sendSuccess(res, 'Service deleted successfully.', null, 204);
  });
}

module.exports = ServiceController;
