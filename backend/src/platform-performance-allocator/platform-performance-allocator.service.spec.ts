import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformPerformanceAllocatorService } from './platform-performance-allocator.service';
import { PlatformPerformanceAllocator } from '../database/entities/platform-performance-allocator.entity';

describe('PlatformPerformanceAllocatorService', () => {
  let service: PlatformPerformanceAllocatorService;
  let repository: jest.Mocked<Repository<PlatformPerformanceAllocator>>;

  const mockEntity: Partial<PlatformPerformanceAllocator> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-1',
    name: 'Test Platform performance allocator',
    description: 'Test description',
    configuration: { enabled: true, settings: {} },
    metrics: { totalProcessed: 100, successRate: 0.95, lastRun: new Date() },
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
        PlatformPerformanceAllocatorService,
        {
          provide: getRepositoryToken(PlatformPerformanceAllocator),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PlatformPerformanceAllocatorService>(PlatformPerformanceAllocatorService);
    repository = module.get(getRepositoryToken(PlatformPerformanceAllocator));
  });

  describe('create', () => {
    it('should successfully create entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Platform performance allocator',
        description: 'Test description',
        configuration: { enabled: true, settings: {} }
      };

      repository.create.mockReturnValue(mockEntity as PlatformPerformanceAllocator);
      repository.save.mockResolvedValue(mockEntity as PlatformPerformanceAllocator);

      const result = await service.create(dto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      repository.find.mockResolvedValue([mockEntity as PlatformPerformanceAllocator]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([mockEntity]);
    });

    it('should return empty array when no entities found', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an entity by id', async () => {
      repository.findOne.mockResolvedValue(mockEntity as PlatformPerformanceAllocator);

      const result = await service.findOne('123');

      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('analyze', () => {
    it('should analyze entity', async () => {
      repository.findOne.mockResolvedValue(mockEntity as PlatformPerformanceAllocator);

      const result = await service.analyze('123');

      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
    });

    it('should throw error when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.analyze('nonexistent')).rejects.toThrow('Platform performance allocator not found');
    });
  });

  describe('update', () => {
    it('should update entity successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedEntity as PlatformPerformanceAllocator);

      const result = await service.update('123', updates);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw error when entity not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow('Platform performance allocator not found after update');
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
