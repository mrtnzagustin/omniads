import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicProductFeedOptimizerService } from './dynamic-product-feed-optimizer.service';
import { ProductFeed } from '../database/entities/features-088-107';
import { NotFoundException } from '@nestjs/common';

describe('DynamicProductFeedOptimizerService', () => {
  let service: DynamicProductFeedOptimizerService;
  let repository: Repository<ProductFeed>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamicProductFeedOptimizerService,
        {
          provide: getRepositoryToken(ProductFeed),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DynamicProductFeedOptimizerService>(DynamicProductFeedOptimizerService);
    repository = module.get<Repository<ProductFeed>>(getRepositoryToken(ProductFeed));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of entities', async () => {
      const entities = [{ id: '1' }, { id: '2' }];
      mockRepository.find.mockResolvedValue(entities);

      const result = await service.findAll({});
      expect(result).toEqual(entities);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      const entity = { id: '1', name: 'Test' };
      mockRepository.findOne.mockResolvedValue(entity);

      const result = await service.findOne('1');
      expect(result).toEqual(entity);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new entity', async () => {
      const data = { name: 'New Entity' };
      const entity = { id: '1', ...data };
      mockRepository.create.mockReturnValue(entity);
      mockRepository.save.mockResolvedValue(entity);

      const result = await service.create(data);
      expect(result).toEqual(entity);
      expect(mockRepository.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('update', () => {
    it('should update and return the entity', async () => {
      const entity = { id: '1', name: 'Updated' };
      mockRepository.findOne.mockResolvedValue(entity);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('1', { name: 'Updated' });
      expect(mockRepository.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove the entity', async () => {
      const entity = { id: '1' };
      mockRepository.findOne.mockResolvedValue(entity);
      mockRepository.remove.mockResolvedValue(entity);

      await service.remove('1');
      expect(mockRepository.remove).toHaveBeenCalledWith(entity);
    });
  });

  describe('process', () => {
    it('should process the entity successfully', async () => {
      const entity = { id: '1', name: 'Test' };
      mockRepository.findOne.mockResolvedValue(entity);

      const result = await service.process('1', {});
      expect(result.success).toBe(true);
      expect(result.entityId).toBe('1');
    });
  });
});
