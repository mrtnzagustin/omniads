import { Test, TestingModule } from '@nestjs/testing';
import { MultiBrandOrchestratorController } from './multi-brand-orchestrator.controller';
import { MultiBrandOrchestratorService } from './multi-brand-orchestrator.service';

describe('MultiBrandOrchestratorController', () => {
  let controller: MultiBrandOrchestratorController;
  let service: jest.Mocked<MultiBrandOrchestratorService>;

  const mockPortfolio = {
    id: '123',
    userId: 'user-1',
    portfolioName: 'Test Portfolio',
    brandIds: ['brand-1', 'brand-2'],
    brandConfigs: [],
    crossBrandAllocation: {
      totalBudget: 10000,
      allocationType: 'ai_optimized' as const,
      rebalanceFrequency: 'daily' as const,
      minBudgetPerBrand: 1000,
      maxBudgetPerBrand: 8000
    },
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const mockService = {
      createPortfolio: jest.fn(),
      findAllByUser: jest.fn(),
      findOne: jest.fn(),
      optimizeBrandAllocation: jest.fn(),
      getUnifiedReport: jest.fn(),
      updatePortfolio: jest.fn(),
      deletePortfolio: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultiBrandOrchestratorController],
      providers: [
        {
          provide: MultiBrandOrchestratorService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MultiBrandOrchestratorController>(MultiBrandOrchestratorController);
    service = module.get(MultiBrandOrchestratorService);
  });

  describe('createPortfolio', () => {
    it('should call service and return created portfolio', async () => {
      const dto = {
        userId: 'user-1',
        portfolioName: 'Test Portfolio',
        brandConfigs: [],
        crossBrandAllocation: mockPortfolio.crossBrandAllocation
      };

      service.createPortfolio.mockResolvedValue(mockPortfolio as any);

      const result = await controller.createPortfolio(dto);

      expect(result).toEqual(mockPortfolio);
      expect(service.createPortfolio).toHaveBeenCalledWith(dto);
    });

    it('should propagate service errors', async () => {
      const dto = {
        userId: 'user-1',
        portfolioName: 'Test Portfolio',
        brandConfigs: [],
        crossBrandAllocation: mockPortfolio.crossBrandAllocation
      };

      service.createPortfolio.mockRejectedValue(new Error('Database error'));

      await expect(controller.createPortfolio(dto)).rejects.toThrow('Database error');
    });
  });

  describe('getPortfoliosByUser', () => {
    it('should return all portfolios for a user', async () => {
      service.findAllByUser.mockResolvedValue([mockPortfolio as any]);

      const result = await controller.getPortfoliosByUser('user-1');

      expect(result).toEqual([mockPortfolio]);
      expect(service.findAllByUser).toHaveBeenCalledWith('user-1');
    });

    it('should return empty array when no portfolios found', async () => {
      service.findAllByUser.mockResolvedValue([]);

      const result = await controller.getPortfoliosByUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('getPortfolio', () => {
    it('should return a portfolio by id', async () => {
      service.findOne.mockResolvedValue(mockPortfolio as any);

      const result = await controller.getPortfolio('123');

      expect(result).toEqual(mockPortfolio);
      expect(service.findOne).toHaveBeenCalledWith('123');
    });

    it('should return null when portfolio not found', async () => {
      service.findOne.mockResolvedValue(null);

      const result = await controller.getPortfolio('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('optimizeAllocation', () => {
    it('should call service and return optimized portfolio', async () => {
      const dto = {
        portfolioId: '123',
        performanceData: [
          { brandId: 'brand-1', currentSpend: 6000, revenue: 24000, conversions: 120 }
        ]
      };

      const optimizedPortfolio = { ...mockPortfolio, performanceMetrics: {} };
      service.optimizeBrandAllocation.mockResolvedValue(optimizedPortfolio as any);

      const result = await controller.optimizeAllocation(dto);

      expect(result).toEqual(optimizedPortfolio);
      expect(service.optimizeBrandAllocation).toHaveBeenCalledWith(dto);
    });

    it('should propagate service errors', async () => {
      const dto = {
        portfolioId: 'nonexistent',
        performanceData: []
      };

      service.optimizeBrandAllocation.mockRejectedValue(new Error('Portfolio not found'));

      await expect(controller.optimizeAllocation(dto)).rejects.toThrow('Portfolio not found');
    });
  });

  describe('getUnifiedReport', () => {
    it('should call service and return unified report', async () => {
      const report = {
        portfolioName: 'Test Portfolio',
        totalBrands: 2,
        performanceMetrics: {},
        brandComparison: []
      };

      service.getUnifiedReport.mockResolvedValue(report);

      const result = await controller.getUnifiedReport('123');

      expect(result).toEqual(report);
      expect(service.getUnifiedReport).toHaveBeenCalledWith('123');
    });

    it('should propagate service errors', async () => {
      service.getUnifiedReport.mockRejectedValue(new Error('Portfolio not found'));

      await expect(controller.getUnifiedReport('nonexistent')).rejects.toThrow('Portfolio not found');
    });
  });

  describe('updatePortfolio', () => {
    it('should call service and return updated portfolio', async () => {
      const updates = { portfolioName: 'Updated Portfolio' };
      const updatedPortfolio = { ...mockPortfolio, ...updates };

      service.updatePortfolio.mockResolvedValue(updatedPortfolio as any);

      const result = await controller.updatePortfolio('123', updates);

      expect(result).toEqual(updatedPortfolio);
      expect(service.updatePortfolio).toHaveBeenCalledWith('123', updates);
    });

    it('should propagate service errors', async () => {
      service.updatePortfolio.mockRejectedValue(new Error('Portfolio not found'));

      await expect(controller.updatePortfolio('123', {})).rejects.toThrow('Portfolio not found');
    });
  });

  describe('deletePortfolio', () => {
    it('should call service and return success message', async () => {
      service.deletePortfolio.mockResolvedValue(undefined);

      const result = await controller.deletePortfolio('123');

      expect(result).toEqual({ message: 'Portfolio deleted successfully' });
      expect(service.deletePortfolio).toHaveBeenCalledWith('123');
    });

    it('should propagate service errors', async () => {
      service.deletePortfolio.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.deletePortfolio('123')).rejects.toThrow('Delete failed');
    });
  });
});
