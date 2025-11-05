import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SentimentDrivenBudgetAllocatorService } from './sentiment-driven-budget-allocator.service';
import { SentimentDrivenBudgetAllocator } from './sentiment-driven-budget-allocator.entity';

describe('SentimentDrivenBudgetAllocatorService', () => {
  let service: SentimentDrivenBudgetAllocatorService;
  let repository: jest.Mocked<Repository<SentimentDrivenBudgetAllocator>>;

  const mockEntity: Partial<SentimentDrivenBudgetAllocator> = {
    id: '1',
    name: 'Test Entity',
    config: { test: true },
    results: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentimentDrivenBudgetAllocatorService,
        {
          provide: getRepositoryToken(SentimentDrivenBudgetAllocator),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SentimentDrivenBudgetAllocatorService>(SentimentDrivenBudgetAllocatorService);
    repository = module.get(getRepositoryToken(SentimentDrivenBudgetAllocator));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all entities', async () => {
    repository.find.mockResolvedValue([mockEntity as SentimentDrivenBudgetAllocator]);
    const result = await service.findAll();
    expect(result).toEqual([mockEntity]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as SentimentDrivenBudgetAllocator);
    const result = await service.findOne('1');
    expect(result).toEqual(mockEntity);
  });

  it('should create entity', async () => {
    repository.create.mockReturnValue(mockEntity as SentimentDrivenBudgetAllocator);
    repository.save.mockResolvedValue(mockEntity as SentimentDrivenBudgetAllocator);
    const result = await service.create(mockEntity);
    expect(result).toEqual(mockEntity);
  });

  it('should process entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as SentimentDrivenBudgetAllocator);
    repository.update.mockResolvedValue(undefined);
    const result = await service.process('1');
    expect(result.processed).toBe(true);
    expect(result.data).toEqual(mockEntity.config);
  });

  it('should throw error when processing non-existent entity', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.process('999')).rejects.toThrow();
  });
});
