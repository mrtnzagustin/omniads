import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AICopywriterMultivariateService } from './ai-copywriter-multivariate.service';
import { AICopywriterMultivariate } from './ai-copywriter-multivariate.entity';

describe('AICopywriterMultivariateService', () => {
  let service: AICopywriterMultivariateService;
  let repository: jest.Mocked<Repository<AICopywriterMultivariate>>;

  const mockEntity: Partial<AICopywriterMultivariate> = {
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
        AICopywriterMultivariateService,
        {
          provide: getRepositoryToken(AICopywriterMultivariate),
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

    service = module.get<AICopywriterMultivariateService>(AICopywriterMultivariateService);
    repository = module.get(getRepositoryToken(AICopywriterMultivariate));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all entities', async () => {
    repository.find.mockResolvedValue([mockEntity as AICopywriterMultivariate]);
    const result = await service.findAll();
    expect(result).toEqual([mockEntity]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as AICopywriterMultivariate);
    const result = await service.findOne('1');
    expect(result).toEqual(mockEntity);
  });

  it('should create entity', async () => {
    repository.create.mockReturnValue(mockEntity as AICopywriterMultivariate);
    repository.save.mockResolvedValue(mockEntity as AICopywriterMultivariate);
    const result = await service.create(mockEntity);
    expect(result).toEqual(mockEntity);
  });

  it('should process entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as AICopywriterMultivariate);
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
