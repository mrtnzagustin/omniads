import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { BudgetPacingControllerService } from './budget-pacing-controller.service';
import { BudgetPacingController } from '../database/entities/budget-pacing-controller.entity';

describe('BudgetPacingControllerService', () => {
  let service: BudgetPacingControllerService;
  let repository: Repository<BudgetPacingController>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockEntity: Partial<BudgetPacingController> = {
    id: '123',
    userId: 'user1',
    name: 'Test Entity',
    description: 'Test Description',
    configuration: {
      enabled: true,
      settings: {},
    },
    metrics: {
      totalProcessed: 100,
      successRate: 95,
      lastRun: new Date(),
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetPacingControllerService,
        {
          provide: getRepositoryToken(BudgetPacingController),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BudgetPacingControllerService>(BudgetPacingControllerService);
    repository = module.get<Repository<BudgetPacingController>>(getRepositoryToken(BudgetPacingController));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      mockRepository.create.mockReturnValue(mockEntity);
      mockRepository.save.mockResolvedValue(mockEntity);

      const result = await service.create('user1', {
        name: 'Test Entity',
        description: 'Test Description',
      });

      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      mockRepository.find.mockResolvedValue([mockEntity]);

      const result = await service.findAllByUser('user1');

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockEntity]);
    });

    it('should return empty array if no entities found', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAllByUser('user1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);

      const result = await service.findOne('123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(result).toEqual(mockEntity);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updatedEntity = { ...mockEntity, name: 'Updated Name' };
      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.save.mockResolvedValue(updatedEntity);

      const result = await service.update('123', { name: 'Updated Name' });

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Name');
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('999', { name: 'Updated' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);
      mockRepository.remove.mockResolvedValue(mockEntity);

      await service.delete('123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockEntity);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('analyze', () => {
    it('should return analysis for an entity', async () => {
      mockRepository.findOne.mockResolvedValue(mockEntity);

      const result = await service.analyze('123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('nextSteps');
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.insights).toBeInstanceOf(Array);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.analyze('999')).rejects.toThrow(NotFoundException);
    });
  });
});
