import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiSpendVelocityControllerService } from './ai-spend-velocity-controller.service';
import { AiSpendVelocityController } from '../database/entities/ai-spend-velocity-controller.entity';

describe('AiSpendVelocityControllerService', () => {
  let service: AiSpendVelocityControllerService;
  let repository: jest.Mocked<Repository<AiSpendVelocityController>>;

  const mockEntity: Partial<AiSpendVelocityController> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-1',
    name: 'Test Velocity Controller',
    description: 'Test description',
    configuration: {
      targetSpendRate: 1000,
      timeframe: 'daily',
      velocityThresholds: {
        slowdown: 800,
        optimal: 1000,
        accelerate: 1200
      },
      budgetConstraints: {
        minDailySpend: 500,
        maxDailySpend: 2000,
        totalBudget: 30000
      },
      performanceGates: [
        { metric: 'roas', threshold: 2.0, action: 'pause' }
      ],
      adjustmentRules: [
        { condition: 'underperforming', adjustment: -0.2, cooldownPeriod: 24 }
      ]
    },
    metrics: {
      currentVelocity: 950,
      targetVelocity: 1000,
      spendToDate: 15000,
      projectedSpend: 30000,
      adjustmentsCount: 5,
      performanceScore: 85,
      velocityHistory: []
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
        AiSpendVelocityControllerService,
        {
          provide: getRepositoryToken(AiSpendVelocityController),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AiSpendVelocityControllerService>(AiSpendVelocityControllerService);
    repository = module.get(getRepositoryToken(AiSpendVelocityController));
  });

  describe('create', () => {
    it('should successfully create an AI spend velocity controller', async () => {
      const dto = {
        userId: 'user-1',
        name: 'Test Velocity Controller',
        description: 'Test description',
        configuration: mockEntity.configuration!
      };

      repository.create.mockReturnValue(mockEntity as AiSpendVelocityController);
      repository.save.mockResolvedValue(mockEntity as AiSpendVelocityController);

      const result = await service.create(dto);

      expect(result).toEqual(mockEntity);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      repository.find.mockResolvedValue([mockEntity as AiSpendVelocityController]);

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
      repository.findOne.mockResolvedValue(mockEntity as AiSpendVelocityController);

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
    it('should analyze velocity controller', async () => {
      repository.findOne.mockResolvedValue(mockEntity as AiSpendVelocityController);

      const result = await service.analyze('123');

      expect(result).toBeDefined();
      expect(result.velocityAnalysis).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });

    it('should throw error when entity not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.analyze('nonexistent')).rejects.toThrow('AI spend velocity controller not found');
    });
  });

  describe('update', () => {
    it('should update entity successfully', async () => {
      const updates = { name: 'Updated Name' };
      const updatedEntity = { ...mockEntity, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedEntity as AiSpendVelocityController);

      const result = await service.update('123', updates);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw error when entity not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update('123', {})).rejects.toThrow('AI spend velocity controller not found after update');
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
