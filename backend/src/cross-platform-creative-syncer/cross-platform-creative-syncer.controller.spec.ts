import { Test, TestingModule } from '@nestjs/testing';
import { CrossPlatformCreativeSyncerController } from './cross-platform-creative-syncer.controller';
import { CrossPlatformCreativeSyncerService } from './cross-platform-creative-syncer.service';

describe('CrossPlatformCreativeSyncerController', () => {
  let controller: CrossPlatformCreativeSyncerController;
  let service: jest.Mocked<CrossPlatformCreativeSyncerService>;

  const mockEntity = {
    id: '123',
    userId: 'user-1',
    name: 'Test Creative Syncer',
    description: 'Test description',
    configuration: {
      platforms: ['facebook', 'instagram'],
      creativeAssets: [],
      syncSettings: {
        autoSync: true,
        syncFrequency: 'daily',
        conflictResolution: 'newest_wins'
      },
      transformationRules: []
    },
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
      controllers: [CrossPlatformCreativeSyncerController],
      providers: [
        {
          provide: CrossPlatformCreativeSyncerService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CrossPlatformCreativeSyncerController>(CrossPlatformCreativeSyncerController);
    service = module.get(CrossPlatformCreativeSyncerService);
  });

  describe('create', () => {
    it('should call service and return created entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Creative Syncer',
        description: 'Test description',
        configuration: mockEntity.configuration
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
        configuration: mockEntity.configuration
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
      expect(service.findAllByUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      service.findOne.mockResolvedValue(mockEntity as any);

      const result = await controller.findOne('123');

      expect(result).toEqual(mockEntity);
      expect(service.findOne).toHaveBeenCalledWith('123');
    });

    it('should return null when entity not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('analyze', () => {
    it('should call service and return analysis', async () => {
      const analysis = {
        id: '123',
        syncAnalysis: {},
        performance: {},
        recommendations: []
      };

      service.analyze.mockResolvedValue(analysis);

      const result = await controller.analyze('123');

      expect(result).toEqual(analysis);
      expect(service.analyze).toHaveBeenCalledWith('123');
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
      expect(service.update).toHaveBeenCalledWith('123', updates);
    });
  });

  describe('delete', () => {
    it('should call service and return success message', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(result).toEqual({ message: 'Cross-platform creative syncer deleted successfully' });
      expect(service.delete).toHaveBeenCalledWith('123');
    });
  });
});
