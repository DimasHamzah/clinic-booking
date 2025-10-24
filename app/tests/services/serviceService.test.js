const ServiceService = require("../../services/serviceService");

// --- Mock Dependencies ---
const mockServiceRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// --- Instantiate the Service with Mocks ---
const serviceService = new ServiceService({
  serviceRepository: mockServiceRepository,
  logger: mockLogger,
});

describe("ServiceService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Test for createService ---
  describe("createService", () => {
    it("should create a service successfully", async () => {
      const serviceData = {
        name: "Facial",
        description: "A nice facial",
        duration_minutes: 60,
        price: 150000,
      };
      const createdService = { id: 1, ...serviceData };
      mockServiceRepository.create.mockResolvedValue(createdService);

      const result = await serviceService.createService(serviceData);

      expect(mockServiceRepository.create).toHaveBeenCalledWith(serviceData);
      expect(result).toEqual(createdService);
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("created successfully"),
      );
    });
  });

  // --- Test for getServiceById ---
  describe("getServiceById", () => {
    it("should return a service by ID", async () => {
      const service = { id: 1, name: "Facial" };
      mockServiceRepository.findById.mockResolvedValue(service);

      const result = await serviceService.getServiceById(1);

      expect(mockServiceRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(service);
    });

    it("should return null if service not found", async () => {
      mockServiceRepository.findById.mockResolvedValue(null);

      const result = await serviceService.getServiceById(999);

      expect(result).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith(
        "Service with ID 999 not found.",
      );
    });
  });

  // --- Test for updateService ---
  describe("updateService", () => {
    it("should update a service successfully", async () => {
      const updatedService = { id: 1, name: "Updated Facial" };
      mockServiceRepository.update.mockResolvedValue(updatedService);

      const result = await serviceService.updateService(1, {
        name: "Updated Facial",
      });

      expect(mockServiceRepository.update).toHaveBeenCalledWith(1, {
        name: "Updated Facial",
      });
      expect(result).toEqual(updatedService);
    });

    it("should throw a 404 error if service to update is not found", async () => {
      mockServiceRepository.update.mockResolvedValue(null);

      await expect(
        serviceService.updateService(999, { name: "Fail" }),
      ).rejects.toThrow("Service not found");
    });
  });

  // --- Test for deleteService ---
  describe("deleteService", () => {
    it("should delete a service successfully", async () => {
      mockServiceRepository.delete.mockResolvedValue(1); // 1 row affected

      const result = await serviceService.deleteService(1);

      expect(mockServiceRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toBe(true);
    });

    it("should throw a 404 error if service to delete is not found", async () => {
      mockServiceRepository.delete.mockResolvedValue(0); // 0 rows affected

      await expect(serviceService.deleteService(999)).rejects.toThrow(
        "Service not found.",
      );
    });
  });
});
