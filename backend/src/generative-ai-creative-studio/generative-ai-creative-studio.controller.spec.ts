import { Test, TestingModule } from '@nestjs/testing';
import { GenerativeAiCreativeStudioController } from './generative-ai-creative-studio.controller';
import { GenerativeAiCreativeStudioService } from './generative-ai-creative-studio.service';
import { GenerativeAiCreativeStudio } from '../database/entities/generative-ai-creative-studio.entity';

describe('GenerativeAiCreativeStudioController', () => {
  let controller: GenerativeAiCreativeStudioController;
  let service: GenerativeAiCreativeStudioService;

  const mockService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    analyze: jest.fn(),
  };

  const mockEntity: Partial<GenerativeAiCreativeStudio> = {
    id: '123',
    userId: 'user1',
    name: 'Test Studio',
    description: 'Test Description',
    configuration: {
      enabled: true,
      aiProvider: 'openai',
      model: 'gpt-4',
      imageModel: 'dall-e-3',
      creativesPerBatch: 5,
      autoPublish: false,
      platforms: ['meta', 'google'],
      brandGuidelines: {},
      settings: {},
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerativeAiCreativeStudioController],
      providers: [
        {
          provide: GenerativeAiCreativeStudioService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<GenerativeAiCreativeStudioController>(GenerativeAiCreativeStudioController);
    service = module.get<GenerativeAiCreativeStudioService>(GenerativeAiCreativeStudioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      mockService.create.mockResolvedValue(mockEntity);

      const result = await controller.create({
        userId: 'user1',
        data: { name: 'Test Studio', description: 'Test Description' },
      });

      expect(service.create).toHaveBeenCalledWith('user1', {
        name: 'Test Studio',
        description: 'Test Description',
      });
      expect(result).toEqual(mockEntity);
    });
  });

  describe('findAllByUser', () => {
    it('should return all entities for a user', async () => {
      mockService.findAllByUser.mockResolvedValue([mockEntity]);

      const result = await controller.findAllByUser('user1');

      expect(service.findAllByUser).toHaveBeenCalledWith('user1');
      expect(result).toEqual([mockEntity]);
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      mockService.findOne.mockResolvedValue(mockEntity);

      const result = await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEntity);
    });
  });

  describe('analyze', () => {
    it('should return analysis for an entity', async () => {
      const mockAnalysis = {
        summary: 'Test Analysis',
        recommendations: [],
        insights: [],
      };
      mockService.analyze.mockResolvedValue(mockAnalysis);

      const result = await controller.analyze('123');

      expect(service.analyze).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockAnalysis);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updatedEntity = { ...mockEntity, name: 'Updated Name' };
      mockService.update.mockResolvedValue(updatedEntity);

      const result = await controller.update('123', { name: 'Updated Name' });

      expect(service.update).toHaveBeenCalledWith('123', { name: 'Updated Name' });
      expect(result).toEqual(updatedEntity);
    });
  });

  describe('delete', () => {
    it('should delete an entity', async () => {
      mockService.delete.mockResolvedValue(undefined);

      const result = await controller.delete('123');

      expect(service.delete).toHaveBeenCalledWith('123');
      expect(result).toEqual({ message: 'Deleted successfully' });
    });
  });
});
