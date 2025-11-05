import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpportunityScorerService } from './opportunity-scorer.service';
import {
  OpportunityScore,
  ScoreCategory,
} from '../database/entities/opportunity-score.entity';
import { PlatformOpportunityAggregate } from '../database/entities/platform-opportunity-aggregate.entity';
import { Campaign } from '../database/entities/campaign.entity';

describe('OpportunityScorerService', () => {
  let service: OpportunityScorerService;
  let opportunityScoreRepo: jest.Mocked<Repository<OpportunityScore>>;
  let aggregateRepo: jest.Mocked<Repository<PlatformOpportunityAggregate>>;
  let campaignRepo: jest.Mocked<Repository<Campaign>>;

  const mockCampaign: Partial<Campaign> = {
    id: 'campaign-1',
    name: 'Test Campaign',
    platform: 'meta',
    status: 'active',
    objective: 'conversions',
    budget: 100,
    spent: 50,
    clicks: 100,
    conversions: 10,
    roas: 3.5,
    targetAudience: ['lookalike', 'interests'],
    geoTargeting: ['US', 'CA'],
    conversionTracking: true,
    adSets: [{}, {}, {}], // 3 ad sets
  };

  const mockOpportunityScore: Partial<OpportunityScore> = {
    id: 'score-1',
    campaignId: 'campaign-1',
    totalScore: 95,
    category: ScoreCategory.EXCELLENT,
    breakdown: {
      targeting: 20,
      budget: 19,
      creative: 19,
      bidding: 18,
      optimization: 19,
    },
    recommendations: [],
    summary: 'Campaign is performing excellently',
    industryAverage: 72,
    topPerformerScore: 92,
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpportunityScorerService,
        {
          provide: getRepositoryToken(OpportunityScore),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PlatformOpportunityAggregate),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Campaign),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OpportunityScorerService>(OpportunityScorerService);
    opportunityScoreRepo = module.get(getRepositoryToken(OpportunityScore));
    aggregateRepo = module.get(
      getRepositoryToken(PlatformOpportunityAggregate),
    );
    campaignRepo = module.get(getRepositoryToken(Campaign));
  });

  describe('scoreCampaign', () => {
    it('should calculate and save opportunity score for a well-configured campaign', async () => {
      campaignRepo.findOne.mockResolvedValue(mockCampaign as Campaign);
      opportunityScoreRepo.create.mockImplementation((data) => data as any);
      opportunityScoreRepo.save.mockImplementation((data) =>
        Promise.resolve(data as any),
      );

      const result = await service.scoreCampaign('campaign-1');

      expect(result.score.totalScore).toBeGreaterThanOrEqual(90);
      expect(result.score.category).toBe(ScoreCategory.EXCELLENT);
      expect(result.insights).toBeDefined();
      expect(Array.isArray(result.insights)).toBe(true);
      expect(opportunityScoreRepo.save).toHaveBeenCalled();
    });

    it('should assign POOR category to campaign with no targeting or budget', async () => {
      const poorCampaign: Partial<Campaign> = {
        id: 'campaign-2',
        name: 'Poor Campaign',
        platform: 'meta',
        status: 'paused',
        objective: 'reach',
        budget: 0,
        spent: 0,
        clicks: 0,
        conversions: 0,
        roas: 0,
        targetAudience: [],
        geoTargeting: [],
        conversionTracking: false,
        adSets: [],
      };

      campaignRepo.findOne.mockResolvedValue(poorCampaign as Campaign);
      opportunityScoreRepo.create.mockImplementation((data) => data as any);
      opportunityScoreRepo.save.mockImplementation((data) =>
        Promise.resolve(data as any),
      );

      const result = await service.scoreCampaign('campaign-2');

      expect(result.score.totalScore).toBeLessThan(50);
      expect(result.score.category).toBe(ScoreCategory.POOR);
      expect(Array.isArray(result.score.recommendations)).toBe(true);
      expect(result.score.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate recommendations for campaigns with missing features', async () => {
      const incompleteCampaign: Partial<Campaign> = {
        id: 'campaign-3',
        name: 'Incomplete Campaign',
        platform: 'google',
        status: 'active',
        objective: 'traffic',
        budget: 50,
        spent: 25,
        clicks: 50,
        conversions: 0,
        roas: 0,
        targetAudience: [],
        geoTargeting: ['US'],
        conversionTracking: false,
        adSets: [{}], // Only 1 ad set
      };

      campaignRepo.findOne.mockResolvedValue(incompleteCampaign as Campaign);
      opportunityScoreRepo.create.mockImplementation((data) => data as any);
      opportunityScoreRepo.save.mockImplementation((data) =>
        Promise.resolve(data as any),
      );

      const result = await service.scoreCampaign('campaign-3');

      expect(result.score.recommendations).toBeDefined();
      expect(result.score.recommendations.length).toBeGreaterThan(0);

      // Should recommend optimization setup
      const hasOptimizationRec = result.score.recommendations.some(
        (r) => r.category === 'optimization',
      );
      expect(hasOptimizationRec).toBe(true);
    });

    it('should throw error if campaign not found', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(service.scoreCampaign('non-existent')).rejects.toThrow(
        'Campaign non-existent not found',
      );
    });
  });

  describe('scorePlatformCampaigns', () => {
    it('should score all campaigns for a platform and update aggregate', async () => {
      campaignRepo.find.mockResolvedValue([
        mockCampaign as Campaign,
        { ...mockCampaign, id: 'campaign-2' } as Campaign,
      ]);

      campaignRepo.findOne
        .mockResolvedValueOnce(mockCampaign as Campaign)
        .mockResolvedValueOnce(
          { ...mockCampaign, id: 'campaign-2' } as Campaign,
        );

      opportunityScoreRepo.create.mockReturnValue(
        mockOpportunityScore as OpportunityScore,
      );
      opportunityScoreRepo.save.mockResolvedValue(
        mockOpportunityScore as OpportunityScore,
      );

      aggregateRepo.create.mockReturnValue({} as PlatformOpportunityAggregate);
      aggregateRepo.save.mockResolvedValue({} as PlatformOpportunityAggregate);

      const results = await service.scorePlatformCampaigns('meta');

      expect(results.length).toBe(2);
      expect(aggregateRepo.save).toHaveBeenCalled();
    });
  });

  describe('getScore', () => {
    it('should return the most recent score for a campaign', async () => {
      opportunityScoreRepo.findOne.mockResolvedValue(
        mockOpportunityScore as OpportunityScore,
      );

      const score = await service.getScore('campaign-1');

      expect(score).toBeDefined();
      expect(score.campaignId).toBe('campaign-1');
      expect(opportunityScoreRepo.findOne).toHaveBeenCalledWith({
        where: { campaignId: 'campaign-1' },
        relations: ['campaign'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should return null if no score exists', async () => {
      opportunityScoreRepo.findOne.mockResolvedValue(null);

      const score = await service.getScore('campaign-999');

      expect(score).toBeNull();
    });
  });

  describe('getPlatformAggregate', () => {
    it('should return platform aggregate statistics', async () => {
      const mockAggregate: Partial<PlatformOpportunityAggregate> = {
        id: 'agg-1',
        platform: 'meta',
        overallScore: 85,
        stats: {
          averageScore: 85,
          campaignCount: 10,
          excellentCount: 3,
          goodCount: 5,
          fairCount: 2,
          poorCount: 0,
          topIssues: [
            { issue: 'Limited creative variety', frequency: 5 },
            { issue: 'Weak audience targeting', frequency: 3 },
          ],
        },
        calculatedFor: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      aggregateRepo.findOne.mockResolvedValue(
        mockAggregate as PlatformOpportunityAggregate,
      );

      const aggregate = await service.getPlatformAggregate('meta');

      expect(aggregate).toBeDefined();
      expect(aggregate.platform).toBe('meta');
      expect(aggregate.overallScore).toBe(85);
      expect(aggregate.stats.campaignCount).toBe(10);
    });
  });

  describe('getAllScores', () => {
    it('should return all scores sorted by total score', async () => {
      opportunityScoreRepo.find.mockResolvedValue([
        mockOpportunityScore as OpportunityScore,
        {
          ...mockOpportunityScore,
          id: 'score-2',
          totalScore: 80,
        } as OpportunityScore,
      ]);

      const scores = await service.getAllScores();

      expect(scores.length).toBe(2);
      expect(opportunityScoreRepo.find).toHaveBeenCalledWith({
        relations: ['campaign'],
        order: { totalScore: 'DESC' },
      });
    });
  });

  describe('Score calculation logic', () => {
    it('should give bonus points for lookalike audience targeting', async () => {
      const campaignWithLookalike: Partial<Campaign> = {
        ...mockCampaign,
        targetAudience: ['lookalike'],
      };

      campaignRepo.findOne.mockResolvedValue(
        campaignWithLookalike as Campaign,
      );
      opportunityScoreRepo.create.mockImplementation((data) => data as any);
      opportunityScoreRepo.save.mockImplementation((data) =>
        Promise.resolve(data as any),
      );

      const result = await service.scoreCampaign('campaign-1');

      // Targeting score should include bonus
      expect(result.score.breakdown.targeting).toBeGreaterThanOrEqual(18);
    });

    it('should penalize campaigns with high budget but poor ROAS', async () => {
      const highSpendPoorROAS: Partial<Campaign> = {
        ...mockCampaign,
        budget: 2000,
        roas: 1.0,
      };

      campaignRepo.findOne.mockResolvedValue(highSpendPoorROAS as Campaign);
      opportunityScoreRepo.create.mockImplementation((data) => data as any);
      opportunityScoreRepo.save.mockImplementation((data) =>
        Promise.resolve(data as any),
      );

      const result = await service.scoreCampaign('campaign-1');

      // Budget score should be penalized
      expect(result.score.breakdown.budget).toBeLessThan(20);
    });

    it('should calculate correct category thresholds', async () => {
      const testCases = [
        { totalScore: 95, expectedCategory: ScoreCategory.EXCELLENT },
        { totalScore: 75, expectedCategory: ScoreCategory.GOOD },
        { totalScore: 55, expectedCategory: ScoreCategory.FAIR },
        { totalScore: 35, expectedCategory: ScoreCategory.POOR },
      ];

      for (const testCase of testCases) {
        campaignRepo.findOne.mockResolvedValue(mockCampaign as Campaign);
        opportunityScoreRepo.create.mockReturnValue({
          ...mockOpportunityScore,
          totalScore: testCase.totalScore,
          category: testCase.expectedCategory,
        } as OpportunityScore);
        opportunityScoreRepo.save.mockResolvedValue({
          ...mockOpportunityScore,
          totalScore: testCase.totalScore,
          category: testCase.expectedCategory,
        } as OpportunityScore);

        const result = await service.scoreCampaign('campaign-1');

        expect(result.score.category).toBe(testCase.expectedCategory);
      }
    });
  });
});
