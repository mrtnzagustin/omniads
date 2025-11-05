import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerLifecycleJourneyMapperService } from './customer-lifecycle-journey-mapper.service';
import { CustomerLifecycleJourneyMapper } from './customer-lifecycle-journey-mapper.entity';

describe('CustomerLifecycleJourneyMapperService', () => {
  let service: CustomerLifecycleJourneyMapperService;
  let repository: jest.Mocked<Repository<CustomerLifecycleJourneyMapper>>;

  const mockEntity: Partial<CustomerLifecycleJourneyMapper> = {
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
        CustomerLifecycleJourneyMapperService,
        {
          provide: getRepositoryToken(CustomerLifecycleJourneyMapper),
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

    service = module.get<CustomerLifecycleJourneyMapperService>(CustomerLifecycleJourneyMapperService);
    repository = module.get(getRepositoryToken(CustomerLifecycleJourneyMapper));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all entities', async () => {
    repository.find.mockResolvedValue([mockEntity as CustomerLifecycleJourneyMapper]);
    const result = await service.findAll();
    expect(result).toEqual([mockEntity]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should find one entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as CustomerLifecycleJourneyMapper);
    const result = await service.findOne('1');
    expect(result).toEqual(mockEntity);
  });

  it('should create entity', async () => {
    repository.create.mockReturnValue(mockEntity as CustomerLifecycleJourneyMapper);
    repository.save.mockResolvedValue(mockEntity as CustomerLifecycleJourneyMapper);
    const result = await service.create(mockEntity);
    expect(result).toEqual(mockEntity);
  });

  it('should process entity', async () => {
    repository.findOne.mockResolvedValue(mockEntity as CustomerLifecycleJourneyMapper);
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
