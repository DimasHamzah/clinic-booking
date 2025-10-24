class ServiceService {
  constructor({ serviceRepository, logger }) {
    this.serviceRepository = serviceRepository;
    this.logger = logger;
  }

  async createService(serviceData) {
    this.logger.info(`Creating a new service: ${serviceData.name}`);
    const newService = await this.serviceRepository.create(serviceData);
    this.logger.info(
      `Service "${newService.name}" created successfully with ID: ${newService.id}`,
    );
    return newService;
  }

  async getAllServices(options) {
    this.logger.info("Retrieving all services.");
    const result = await this.serviceRepository.findAll(options);
    return result;
  }

  async getServiceById(id) {
    this.logger.info(`Retrieving service with ID: ${id}`);
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      const error = new Error("Service not found.");
      error.statusCode = 404;
      throw error;
    }
    return service;
  }

  async updateService(id, updateData) {
    this.logger.info(`Updating service with ID: ${id}`);
    const updatedService = await this.serviceRepository.update(id, updateData);
    if (!updatedService) {
      const error = new Error("Service not found.");
      error.statusCode = 404;
      throw error;
    }
    this.logger.info(`Service with ID ${id} updated successfully.`);
    return updatedService;
  }

  async deleteService(id) {
    this.logger.info(`Attempting to delete service with ID: ${id}`);
    const deletedRows = await this.serviceRepository.delete(id);
    if (deletedRows === 0) {
      const error = new Error("Service not found.");
      error.statusCode = 404;
      throw error;
    }
    this.logger.info(`Service with ID ${id} deleted successfully.`);
    return true;
  }
}

module.exports = ServiceService;
