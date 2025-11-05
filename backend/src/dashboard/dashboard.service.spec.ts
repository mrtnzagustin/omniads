import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DashboardService } from './dashboard.service';
import { Campaign } from '../database/entities/campaign.entity';
import { AICoreClient } from '../services/ai-core.client';

describe('DashboardService', () => {
  let service: DashboardService;
  let campaignRepository: jest.Mocked<Repository<Campaign>>;
  let aiCoreClient: jest.Mocked<AICoreClient>;

  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campaign 1',
      platform: 'google',
      externalId: 'google-1',
      investment: 1000,
      revenue: 2000,
      roas: 2.0,
      date: new Date('2024-01-15'),
      impressions: 10000,
      clicks: 500,
    },
    {
      id: '2',
      name: 'Campaign 2',
      platform: 'meta',
      externalId: 'meta-1',
      investment: 1500,
      revenue: 3000,
      roas: 2.0,
      date: new Date('2024-01-16'),
      impressions: 15000,
      clicks: 750,
    },
    {
      id: '3',
      name: 'Campaign 3',
      platform: 'tiktok',
      externalId: 'tiktok-1',
      investment: 500,
      revenue: 750,
      roas: 1.5,
      date: new Date('2024-01-17'),
      impressions: 5000,
      clicks: 250,
    },
  ] as Campaign[];

  beforeEach(async () => {
    const mockCampaignRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const mockAiCoreClient = {
      getGlobalInsight: jest.fn(),
      generateRecommendations: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository,
        },
        {
          provide: AICoreClient,
          useValue: mockAiCoreClient,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    campaignRepository = module.get(
      getRepositoryToken(Campaign),
    ) as jest.Mocked<Repository<Campaign>>;
    aiCoreClient = module.get(AICoreClient) as jest.Mocked<AICoreClient>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getKpis', () => {
    it('should calculate KPIs correctly for 30d period', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getKpis('30d');

      // Assert
      expect(campaignRepository.find).toHaveBeenCalledWith({
        where: {
          date: Between(expect.any(Date), expect.any(Date)),
        },
      });
      expect(result).toEqual({
        totalInvestment: 3000,
        totalRevenue: 5750,
        avgRoas: 1.92,
        totalCampaigns: 3,
        period: '30d',
      });
    });

    it('should handle empty campaigns', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getKpis('7d');

      // Assert
      expect(result).toEqual({
        totalInvestment: 0,
        totalRevenue: 0,
        avgRoas: 0,
        totalCampaigns: 0,
        period: '7d',
      });
    });

    it('should calculate ROAS correctly with single campaign', async () => {
      // Arrange
      const singleCampaign = [mockCampaigns[0]];
      campaignRepository.find.mockResolvedValue(singleCampaign);

      // Act
      const result = await service.getKpis('today');

      // Assert
      expect(result).toEqual({
        totalInvestment: 1000,
        totalRevenue: 2000,
        avgRoas: 2.0,
        totalCampaigns: 1,
        period: 'today',
      });
    });

    it('should handle 90d period', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getKpis('90d');

      // Assert
      expect(result.period).toBe('90d');
      expect(result.totalCampaigns).toBe(3);
    });
  });

  describe('getPlatformSummary', () => {
    it('should group campaigns by platform', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getPlatformSummary('30d');

      // Assert
      expect(result).toHaveLength(3);

      const googlePlatform = result.find(p => p.platform === 'google');
      expect(googlePlatform).toEqual({
        platform: 'google',
        investment: 1000,
        revenue: 2000,
        roas: 2.0,
        campaignCount: 1,
      });

      const metaPlatform = result.find(p => p.platform === 'meta');
      expect(metaPlatform).toEqual({
        platform: 'meta',
        investment: 1500,
        revenue: 3000,
        roas: 2.0,
        campaignCount: 1,
      });

      const tiktokPlatform = result.find(p => p.platform === 'tiktok');
      expect(tiktokPlatform).toEqual({
        platform: 'tiktok',
        investment: 500,
        revenue: 750,
        roas: 1.5,
        campaignCount: 1,
      });
    });

    it('should handle platforms with no campaigns', async () => {
      // Arrange
      const singlePlatformCampaigns = [mockCampaigns[0]];
      campaignRepository.find.mockResolvedValue(singlePlatformCampaigns);

      // Act
      const result = await service.getPlatformSummary('7d');

      // Assert
      const googlePlatform = result.find(p => p.platform === 'google');
      expect(googlePlatform?.campaignCount).toBe(1);

      const metaPlatform = result.find(p => p.platform === 'meta');
      expect(metaPlatform?.campaignCount).toBe(0);
      expect(metaPlatform?.investment).toBe(0);
      expect(metaPlatform?.revenue).toBe(0);
      expect(metaPlatform?.roas).toBe(0);
    });

    it('should calculate aggregated metrics per platform', async () => {
      // Arrange
      const multiGoogleCampaigns = [
        mockCampaigns[0],
        {
          ...mockCampaigns[0],
          id: '4',
          externalId: 'google-2',
          investment: 2000,
          revenue: 4000,
          roas: 2.0,
        } as Campaign,
      ];
      campaignRepository.find.mockResolvedValue(multiGoogleCampaigns);

      // Act
      const result = await service.getPlatformSummary('30d');

      // Assert
      const googlePlatform = result.find(p => p.platform === 'google');
      expect(googlePlatform).toEqual({
        platform: 'google',
        investment: 3000,
        revenue: 6000,
        roas: 2.0,
        campaignCount: 2,
      });
    });
  });

  describe('getTopCampaigns', () => {
    it('should return top 5 campaigns by ROAS', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getTopCampaigns('30d', 5);

      // Assert
      expect(campaignRepository.find).toHaveBeenCalledWith({
        where: {
          date: Between(expect.any(Date), expect.any(Date)),
        },
        order: {
          roas: 'DESC',
        },
        take: 5,
      });
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('platform');
      expect(result[0]).toHaveProperty('roas');
    });

    it('should use default limit of 5 if not specified', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      await service.getTopCampaigns('7d');

      // Assert
      expect(campaignRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });

    it('should return empty array when no campaigns exist', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getTopCampaigns('30d', 5);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getBottomCampaigns', () => {
    it('should return bottom 5 campaigns by ROAS', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getBottomCampaigns('30d', 5);

      // Assert
      expect(campaignRepository.find).toHaveBeenCalledWith({
        where: {
          date: Between(expect.any(Date), expect.any(Date)),
        },
        order: {
          roas: 'ASC',
        },
        take: 5,
      });
      expect(result).toHaveLength(3);
    });

    it('should use default limit of 5 if not specified', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      await service.getBottomCampaigns('7d');

      // Assert
      expect(campaignRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5,
        }),
      );
    });
  });

  describe('getGlobalInsight', () => {
    it('should return AI-generated global insight', () => {
      // Arrange
      const mockInsight =
        'Your Google Ads campaigns are performing well with an average ROAS of 2.5x.';
      aiCoreClient.getGlobalInsight.mockReturnValue(mockInsight);

      // Act
      const result = service.getGlobalInsight();

      // Assert
      expect(aiCoreClient.getGlobalInsight).toHaveBeenCalled();
      expect(result.insight).toBe(mockInsight);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should include timestamp with insight', () => {
      // Arrange
      const beforeTimestamp = new Date();
      aiCoreClient.getGlobalInsight.mockReturnValue('Test insight');

      // Act
      const result = service.getGlobalInsight();
      const afterTimestamp = new Date();

      // Assert
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeTimestamp.getTime(),
      );
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(
        afterTimestamp.getTime(),
      );
    });
  });

  describe('getRoasTrends', () => {
    it('should return ROAS trends for all platforms', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getRoasTrends('7d');

      // Assert
      expect(result).toHaveProperty('google');
      expect(result).toHaveProperty('meta');
      expect(result).toHaveProperty('tiktok');
      expect(result.google).toBeInstanceOf(Array);
      expect(result.meta).toBeInstanceOf(Array);
      expect(result.tiktok).toBeInstanceOf(Array);
    });

    it('should generate correct number of data points for period', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getRoasTrends('7d');

      // Assert
      expect(result.google).toHaveLength(7);
      expect(result.meta).toHaveLength(7);
      expect(result.tiktok).toHaveLength(7);
    });

    it('should generate 30 data points for 30d period', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getRoasTrends('30d');

      // Assert
      expect(result.google).toHaveLength(30);
      expect(result.meta).toHaveLength(30);
      expect(result.tiktok).toHaveLength(30);
    });

    it('should format data points with date and roas', async () => {
      // Arrange
      campaignRepository.find.mockResolvedValue(mockCampaigns);

      // Act
      const result = await service.getRoasTrends('7d');

      // Assert
      const firstPoint = result.google[0];
      expect(firstPoint).toHaveProperty('date');
      expect(firstPoint).toHaveProperty('roas');
      expect(typeof firstPoint.date).toBe('string');
      expect(typeof firstPoint.roas).toBe('number');
      expect(firstPoint.roas).toBeGreaterThanOrEqual(0);
    });
  });
});
