import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossPlatformCreativeSyncerService } from './cross-platform-creative-syncer.service';
import { CrossPlatformCreativeSyncer } from '../database/entities/cross-platform-creative-syncer.entity';

describe('CrossPlatformCreativeSyncerService', () => {
  let service: CrossPlatformCreativeSyncerService;
  let repository: jest.Mocked<Repository<CrossPlatformCreativeSyncer>>;

  const mockEntity: Partial<CrossPlatformCreativeSyncer> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-1',
    name: 'Test Creative Syncer',
    description: 'Test description',
    configuration: {
      platforms: ['facebook', 'instagram', 'google'],
      creativeAssets: [
        {
          assetId: 'asset-1',
          assetType: 'image',
          originalPlatform: 'facebook',
          adaptations: [
            { platform: 'instagram', format: 'square', dimensions: '1080x1080', status: 'synced' }
          ]
        }
      ],
      syncSettings: {
        autoSync: true,
        syncFrequency: 'daily',
        conflictResolution: 'newest_wins'
      },
      transformationRules: [
        { rule: 'resize', fromPlatform: 'facebook', toPlatform: 'instagram', adjustments: { width: 1080 } }
      ]
    },
    metrics: {
      totalAssets: 1,
      syncedAssets: 1,
      pendingSync: 0,
      failedSync: 0,
      platformCoverage: [
        { platform: 'facebook', assetCount: 1, lastSync: new Date() }
      ],
      syncHistory: []
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
        CrossPlatformCreativeSyncerService,
        {
          provide: getRepositoryToken(CrossPlatformCreativeSyncer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CrossPlatformCreativeSyncerService>(CrossPlatformCreativeSyncerService);
    repository = module.get(getRepositoryToken(CrossPlatformCreativeSyncer));
  });

  describe('create', () => {
    it('should successfully create a cross-platform creative syncer', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Creative Syncer',
        description: 'Test description',
        configuration: mockEntity.configuration!
      };

      repository.create.mockReturnValue(mockEntity as CrossPlatformCreativeSyncer);
      repository.save.mockResolvedValue(mockEntity as CrossPlatformCreativeSyncer);

      const result = await service.create(dto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      repository.find.mockResolvedValue([mockEntity as CrossPlatformCreativeSyncer]);

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
      repository.findOne.mockResolvedValue(mockEntity as CrossPlatformCreativeSyncer);

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
    it('should analyze cross-platform creative syncer', async () => {
      repository.findOne.mockResolvedValue(mockEntity as CrossPlatformCreativeSyncer);

      const result = await service.analyze('123');

      expect(result).toBeDefined();
      expect(result.syncAnalysis).toBeDefined();
      expect(result.performance).toEqual(mockEntity.metrics);
      expect(result.recommendations).toBeDefined();
    });

    it('should throw error when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.analyze('nonexistent')).rejects.toThrow('Cross-platform creative syncer not found');
    });
  });

  describe('update', () => {
    it('should update entity successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedEntity as CrossPlatformCreativeSyncer);

      const result = await service.update('123', updates);

      expect(result.name).toBe('Updated Name');
      expect(repository.update).toHaveBeenCalledWith('123', updates);
    });

    it('should throw error when entity not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow('Cross-platform creative syncer not found after update');
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
