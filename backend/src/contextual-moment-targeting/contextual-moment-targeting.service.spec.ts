import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContextualMomentTargetingService } from './contextual-moment-targeting.service';
import { ContextualMomentTargeting } from '../database/entities/contextual-moment-targeting.entity';

describe('ContextualMomentTargetingService', () => {
  let service: ContextualMomentTargetingService;
  let repository: jest.Mocked<Repository<ContextualMomentTargeting>>;

  const mockEntity: Partial<ContextualMomentTargeting> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-1',
    name: 'Test Contextual Moment',
    description: 'Test description',
    configuration: {
      momentTypes: ['shopping', 'browsing', 'searching'],
      contextualSignals: [
        { signal: 'time_of_day', weight: 0.8, threshold: 0.6 },
        { signal: 'device_type', weight: 0.7, threshold: 0.5 }
      ],
      timeWindows: {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday'],
        hourRange: { start: 9, end: 17 }
      },
      locationContext: {
        enabled: true,
        geofences: ['geo-1', 'geo-2']
      },
      behaviorTriggers: [
        { action: 'product_view', timing: 'immediate', priority: 1 }
      ]
    },
    metrics: {
      totalMoments: 1000,
      momentsCaptured: 750,
      captureRate: 75,
      avgEngagementRate: 0.45,
      conversionRate: 0.12,
      topMoments: [
        { momentType: 'shopping', count: 400, engagementRate: 0.55 }
      ]
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContextualMomentTargetingService,
        {
          provide: getRepositoryToken(ContextualMomentTargeting),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ContextualMomentTargetingService>(ContextualMomentTargetingService);
    repository = module.get(getRepositoryToken(ContextualMomentTargeting));
  });

  describe('create', () => {
    it('should successfully create a contextual moment targeting', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Contextual Moment',
        description: 'Test description',
        configuration: mockEntity.configuration!
      };

      repository.create.mockReturnValue(mockEntity as ContextualMomentTargeting);
      repository.save.mockResolvedValue(mockEntity as ContextualMomentTargeting);

      const result = await service.create(dto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      repository.find.mockResolvedValue([mockEntity as ContextualMomentTargeting]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([mockEntity]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' }
      });
    });

    it('should return empty array when no entities found', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      repository.findOne.mockResolvedValue(mockEntity as ContextualMomentTargeting);

      const result = await service.findOne('123');

      expect(result).toEqual(mockEntity);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
    });

    it('should return null when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('analyze', () => {
    it('should analyze contextual moment targeting', async () => {
      repository.findOne.mockResolvedValue(mockEntity as ContextualMomentTargeting);

      const result = await service.analyze('123');

      expect(result).toBeDefined();
      expect(result.momentAnalysis).toBeDefined();
      expect(result.performance).toEqual(mockEntity.metrics);
      expect(result.recommendations).toBeDefined();
    });

    it('should throw error when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.analyze('nonexistent')).rejects.toThrow('Contextual moment targeting not found');
    });
  });

  describe('update', () => {
    it('should update entity successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedEntity as ContextualMomentTargeting);

      const result = await service.update('123', updates);

      expect(result.name).toBe('Updated Name');
      expect(repository.update).toHaveBeenCalledWith('123', updates);
    });

    it('should throw error when entity not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow('Contextual moment targeting not found after update');
    });
  });

  describe('delete', () => {
    it('should delete entity successfully', async () => {
      repository.delete.mockResolvedValue(undefined as any);

      await service.delete('123');

      expect(repository.delete).toHaveBeenCalledWith('123');
    });
  });
});
