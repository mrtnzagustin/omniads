import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultiBrandOrchestratorService } from './multi-brand-orchestrator.service';
import { BrandPortfolio } from '../database/entities/brand-portfolio.entity';

describe('MultiBrandOrchestratorService', () => {
  let service: MultiBrandOrchestratorService;
  let repository: jest.Mocked<Repository<BrandPortfolio>>;

  const mockPortfolio: Partial<BrandPortfolio> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user-1',
    portfolioName: 'Test Portfolio',
    brandIds: ['brand-1', 'brand-2'],
    brandConfigs: [
      {
        brandId: 'brand-1',
        brandName: 'Brand A',
        budgetShare: 0.6,
        campaignIds: ['camp-1'],
        targetRoas: 3.0,
        priority: 1
      },
      {
        brandId: 'brand-2',
        brandName: 'Brand B',
        budgetShare: 0.4,
        campaignIds: ['camp-2'],
        targetRoas: 2.5,
        priority: 2
      }
    ],
    crossBrandAllocation: {
      totalBudget: 10000,
      allocationType: 'ai_optimized',
      rebalanceFrequency: 'daily',
      minBudgetPerBrand: 1000,
      maxBudgetPerBrand: 8000
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
        MultiBrandOrchestratorService,
        {
          provide: getRepositoryToken(BrandPortfolio),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MultiBrandOrchestratorService>(MultiBrandOrchestratorService);
    repository = module.get(getRepositoryToken(BrandPortfolio));
  });

  describe('createPortfolio', () => {
    it('should successfully create a brand portfolio', async () => {
      const dto = {
        userId: 'user-1',
        portfolioName: 'Test Portfolio',
        brandConfigs: mockPortfolio.brandConfigs!,
        crossBrandAllocation: mockPortfolio.crossBrandAllocation!
      };

      repository.create.mockReturnValue(mockPortfolio as BrandPortfolio);
      repository.save.mockResolvedValue(mockPortfolio as BrandPortfolio);

      const result = await service.createPortfolio(dto);

      expect(result).toEqual(mockPortfolio);
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });

    it('should set AI optimization when allocationType is ai_optimized', async () => {
      const dto = {
        userId: 'user-1',
        portfolioName: 'Test Portfolio',
        brandConfigs: mockPortfolio.brandConfigs!,
        crossBrandAllocation: {
          ...mockPortfolio.crossBrandAllocation!,
          allocationType: 'ai_optimized' as const
        }
      };

      repository.create.mockImplementation((data) => data as BrandPortfolio);
      repository.save.mockResolvedValue(mockPortfolio as BrandPortfolio);

      await service.createPortfolio(dto);

      const createCall = repository.create.mock.calls[0][0];
      expect(createCall.aiOptimization.enabled).toBe(true);
    });
  });

  describe('findAllByUser', () => {
    it('should return all portfolios for a user', async () => {
      repository.find.mockResolvedValue([mockPortfolio as BrandPortfolio]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([mockPortfolio]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        order: { createdAt: 'DESC' }
      });
    });

    it('should return empty array when no portfolios found', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAllByUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a portfolio by id', async () => {
      repository.findOne.mockResolvedValue(mockPortfolio as BrandPortfolio);

      const result = await service.findOne('123');

      expect(result).toEqual(mockPortfolio);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '123' } });
    });

    it('should return null when portfolio not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('optimizeBrandAllocation', () => {
    it('should optimize brand allocation based on performance', async () => {
      const dto = {
        portfolioId: '123',
        performanceData: [
          { brandId: 'brand-1', currentSpend: 6000, revenue: 24000, conversions: 120 },
          { brandId: 'brand-2', currentSpend: 4000, revenue: 8000, conversions: 40 }
        ]
      };

      const portfolioWithMetrics = {
        ...mockPortfolio,
        performanceMetrics: {
          totalSpend: 10000,
          totalRevenue: 32000,
          portfolioRoas: 3.2,
          bestPerformingBrand: 'brand-1',
          worstPerformingBrand: 'brand-2',
          brandPerformances: [
            { brandId: 'brand-1', spend: 6000, revenue: 24000, roas: 4.0, conversions: 120 },
            { brandId: 'brand-2', spend: 4000, revenue: 8000, roas: 2.0, conversions: 40 }
          ]
        }
      };

      repository.findOne.mockResolvedValue(mockPortfolio as BrandPortfolio);
      repository.save.mockResolvedValue(portfolioWithMetrics as BrandPortfolio);

      const result = await service.optimizeBrandAllocation(dto);

      expect(result.performanceMetrics).toBeDefined();
      expect(result.performanceMetrics!.portfolioRoas).toBeGreaterThan(0);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw error when portfolio not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const dto = {
        portfolioId: 'nonexistent',
        performanceData: []
      };

      await expect(service.optimizeBrandAllocation(dto)).rejects.toThrow('Portfolio not found');
    });

    it('should generate recommendations for underperforming brands', async () => {
      const dto = {
        portfolioId: '123',
        performanceData: [
          { brandId: 'brand-1', currentSpend: 6000, revenue: 24000, conversions: 120 },
          { brandId: 'brand-2', currentSpend: 4000, revenue: 4000, conversions: 20 }
        ]
      };

      repository.findOne.mockResolvedValue(mockPortfolio as BrandPortfolio);
      repository.save.mockImplementation(async (data) => data as BrandPortfolio);

      const result = await service.optimizeBrandAllocation(dto);

      expect(result.aiOptimization!.recommendations.length).toBeGreaterThan(0);
      expect(result.aiOptimization!.recommendations.some(r => r.action === 'decrease_budget')).toBe(true);
    });
  });

  describe('getUnifiedReport', () => {
    it('should generate unified report for portfolio', async () => {
      const portfolioWithMetrics = {
        ...mockPortfolio,
        performanceMetrics: {
          totalSpend: 10000,
          totalRevenue: 32000,
          portfolioRoas: 3.2,
          bestPerformingBrand: 'brand-1',
          worstPerformingBrand: 'brand-2',
          brandPerformances: [
            { brandId: 'brand-1', spend: 6000, revenue: 24000, roas: 4.0, conversions: 120 },
            { brandId: 'brand-2', spend: 4000, revenue: 8000, roas: 2.0, conversions: 40 }
          ]
        }
      };

      repository.findOne.mockResolvedValue(portfolioWithMetrics as BrandPortfolio);

      const result = await service.getUnifiedReport('123');

      expect(result.portfolioName).toBe('Test Portfolio');
      expect(result.totalBrands).toBe(2);
      expect(result.brandComparison).toBeDefined();
      expect(result.brandComparison.length).toBe(2);
    });

    it('should throw error when portfolio not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.getUnifiedReport('nonexistent')).rejects.toThrow('Portfolio not found');
    });
  });

  describe('updatePortfolio', () => {
    it('should update portfolio successfully', async () => {
      const updates = { portfolioName: 'Updated Portfolio' };
      const updatedPortfolio = { ...mockPortfolio, ...updates };

      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(updatedPortfolio as BrandPortfolio);

      const result = await service.updatePortfolio('123', updates);

      expect(result.portfolioName).toBe('Updated Portfolio');
      expect(repository.update).toHaveBeenCalledWith('123', updates);
    });

    it('should throw error when portfolio not found after update', async () => {
      repository.update.mockResolvedValue(undefined as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.updatePortfolio('123', {})).rejects.toThrow('Portfolio not found after update');
    });
  });

  describe('deletePortfolio', () => {
    it('should delete portfolio successfully', async () => {
      repository.delete.mockResolvedValue(undefined as any);

      await service.deletePortfolio('123');

      expect(repository.delete).toHaveBeenCalledWith('123');
    });
  });
});
