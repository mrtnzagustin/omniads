import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntelligentFrequencyCapperService } from './intelligent-frequency-capper.service';
import { IntelligentFrequencyCapper } from '../database/entities/intelligent-frequency-capper.entity';

describe('IntelligentFrequencyCapperService', () => {
  let service: IntelligentFrequencyCapperService;
  let repository: jest.Mocked<Repository<IntelligentFrequencyCapper>>;

  const mockEntity: Partial<IntelligentFrequencyCapper> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-1',
    name: 'Test Intelligent frequency capper',
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
        IntelligentFrequencyCapperService,
        {
          provide: getRepositoryToken(IntelligentFrequencyCapper),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IntelligentFrequencyCapperService>(IntelligentFrequencyCapperService);
    repository = module.get(getRepositoryToken(IntelligentFrequencyCapper));
  });

  describe('create', () => {
    it('should successfully create entity', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Intelligent frequency capper',
        description: 'Test description',
        configuration: { enabled: true, settings: {} }
      };

      repository.create.mockReturnValue(mockEntity as IntelligentFrequencyCapper);
      repository.save.mockResolvedValue(mockEntity as IntelligentFrequencyCapper);

      const result = await service.create(dto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      repository.find.mockResolvedValue([mockEntity as IntelligentFrequencyCapper]);

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
      repository.findOne.mockResolvedValue(mockEntity as IntelligentFrequencyCapper);

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
      repository.findOne.mockResolvedValue(mockEntity as IntelligentFrequencyCapper);

      const result = await service.analyze('123');

      expect(result).toBeDefined();
      expect(result.analysis).toBeDefined();
    });

    it('should throw error when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.analyze('nonexistent')).rejects.toThrow('Intelligent frequency capper not found');
    });
  });

  describe('update', () => {
    it('should update entity successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedEntity as IntelligentFrequencyCapper);

      const result = await service.update('123', updates);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw error when entity not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow('Intelligent frequency capper not found after update');
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
