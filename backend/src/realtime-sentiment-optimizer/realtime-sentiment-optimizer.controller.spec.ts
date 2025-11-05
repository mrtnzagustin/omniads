import { Test, TestingModule } from '@nestjs/testing';
import { RealtimeSentimentOptimizerController } from './realtime-sentiment-optimizer.controller';
import { RealtimeSentimentOptimizerService } from './realtime-sentiment-optimizer.service';

describe('RealtimeSentimentOptimizerController', () => {
  let controller: RealtimeSentimentOptimizerController;
  let service: jest.Mocked<RealtimeSentimentOptimizerService>;

  const mockEntity = {
    id: '123',
    userId: 'user-1',
    name: 'Test Realtime sentiment optimizer',
    description: 'Test description',
    configuration: { enabled: true, settings: {} },
    metrics: null,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAllByUser: jest.fn(),
      findOne: jest.fn(),
      analyze: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealtimeSentimentOptimizerController],
      providers: [
        {
          provide: RealtimeSentimentOptimizerService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<RealtimeSentimentOptimizerController>(RealtimeSentimentOptimizerController);
    service = module.get(RealtimeSentimentOptimizerService);
  });

  describe('create', () => {
    it('should call service and return created entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Realtime sentiment optimizer',
        description: 'Test description',
        configuration: { enabled: true, settings: {} }
      };

      service.create.mockResolvedValue(mockEntity as any);

      const result = await controller.create(dto);

      expect(result).toEqual(mockEntity);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should propagate service errors', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test',
        description: 'Test',
        configuration: { enabled: true, settings: {} }
      };

      service.create.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(dto)).rejects.toThrow('Database error');
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      service.findAllByUser.mockResolvedValue([mockEntity as any]);

      const result = await controller.findAllByUser('user-1');

      expect(result).toEqual([mockEntity]);
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      service.findOne.mockResolvedValue(mockEntity as any);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('analyze', () => {
    it('should call service and return analysis', async () => {
      const analysis = { id: '123', analysis: {}, recommendations: [] };

      service.analyze.mockResolvedValue(analysis);

      const result = await controller.analyze('123');

      expect(result).toEqual(analysis);
    });

    it('should propagate service errors', async () => {
      service.analyze.mockRejectedValue(new Error('Not found'));

      await expect(controller.analyze('nonexistent')).rejects.toThrow('Not found');
    });
  });

  describe('update', () => {
    it('should call service and return updated entity', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      service.update.mockResolvedValue(updatedEntity as any);

      const result = await controller.update('123', updates);

      expect(result).toEqual(updatedEntity);
    });
  });

  describe('delete', () => {
    it('should call service and return success message', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(result).toEqual({ message: 'Realtime sentiment optimizer deleted successfully' });
    });
  });
});
