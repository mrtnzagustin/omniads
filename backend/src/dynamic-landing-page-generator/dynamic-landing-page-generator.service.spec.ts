import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicLandingPageGeneratorService } from './dynamic-landing-page-generator.service';
import { DynamicLandingPageGenerator } from './dynamic-landing-page-generator.entity';

describe('DynamicLandingPageGeneratorService', () => {
  let service: DynamicLandingPageGeneratorService;
  let repository: jest.Mocked<Repository<DynamicLandingPageGenerator>>;

  const mockEntity: Partial<DynamicLandingPageGenerator> = {
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
        DynamicLandingPageGeneratorService,
        {
          provide: getRepositoryToken(DynamicLandingPageGenerator),
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

    service = module.get<DynamicLandingPageGeneratorService>(DynamicLandingPageGeneratorService);
    repository = module.get(getRepositoryToken(DynamicLandingPageGenerator));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all entities', async () => {
    repository.find.mockResolvedValue([mockEntity as DynamicLandingPageGenerator]);
    const result = await service.findAll();
    expect(result).toEqual([mockEntity]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as DynamicLandingPageGenerator);
    const result = await service.findOne('1');
    expect(result).toEqual(mockEntity);
  });

  it('should create entity', async () => {
    repository.create.mockReturnValue(mockEntity as DynamicLandingPageGenerator);
    repository.save.mockResolvedValue(mockEntity as DynamicLandingPageGenerator);
    const result = await service.create(mockEntity);
    expect(result).toEqual(mockEntity);
  });

  it('should process entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as DynamicLandingPageGenerator);
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
