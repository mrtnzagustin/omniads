import { Test, TestingModule } from '@nestjs/testing';
import { IncrementalLiftMeasurementController } from './incremental-lift-measurement.controller';
import { IncrementalLiftMeasurementService } from './incremental-lift-measurement.service';
import { IncrementalLiftMeasurement } from '../database/entities/incremental-lift-measurement.entity';

describe('IncrementalLiftMeasurementController', () => {
  let controller: IncrementalLiftMeasurementController;
  let service: IncrementalLiftMeasurementService;

  const mockService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    analyze: jest.fn(),
  };

  const mockEntity: Partial<IncrementalLiftMeasurement> = {
    id: '123',
    userId: 'user1',
    name: 'Test Entity',
    description: 'Test Description',
    configuration: {
      enabled: true,
      settings: {},
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncrementalLiftMeasurementController],
      providers: [
        {
          provide: IncrementalLiftMeasurementService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IncrementalLiftMeasurementController>(IncrementalLiftMeasurementController);
    service = module.get<IncrementalLiftMeasurementService>(IncrementalLiftMeasurementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      mockService.create.mockResolvedValue(mockEntity);

      const result = await controller.create({
        userId: 'user1',
        data: { name: 'Test Entity', description: 'Test Description' },
      });

      expect(service.create).toHaveBeenCalledWith('user1', {
        name: 'Test Entity',
        description: 'Test Description',
      });
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      mockService.findAllByUser.mockResolvedValue([mockEntity]);

      const result = await controller.findAllByUser('user1');

      expect(service.findAllByUser).toHaveBeenCalledWith('user1');
      expect(result).toEqual([mockEntity]);
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      mockService.findOne.mockResolvedValue(mockEntity);

      const result = await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEntity);
    });
  });

  describe('analyze', () => {
    it('should return analysis for an entity', async () => {
      const mockAnalysis = {
        summary: 'Test Analysis',
        recommendations: [],
        insights: [],
      };
      mockService.analyze.mockResolvedValue(mockAnalysis);

      const result = await controller.analyze('123');

      expect(service.analyze).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockAnalysis);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updatedEntity = { ...mockEntity, name: 'Updated Name' };
      mockService.update.mockResolvedValue(updatedEntity);

      const result = await controller.update('123', { name: 'Updated Name' });

      expect(service.update).toHaveBeenCalledWith('123', { name: 'Updated Name' });
      expect(result).toEqual(updatedEntity);
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      mockService.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(service.delete).toHaveBeenCalledWith('123');
      expect(result).toEqual({ message: 'Deleted successfully' });
    });
  });
});
