import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from '../database/entities/keyword.entity';
import { KeywordPerformance } from '../database/entities/keyword-performance.entity';
import { BiddingRecommendation } from '../database/entities/bidding-recommendation.entity';

@Injectable()
export class KeywordIntelligenceService {
  private readonly logger = new Logger(KeywordIntelligenceService.name);

  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
    @InjectRepository(KeywordPerformance)
    private performanceRepository: Repository<KeywordPerformance>,
    @InjectRepository(BiddingRecommendation)
    private recommendationRepository: Repository<BiddingRecommendation>,
  ) {}

  async discoverKeywords(workspaceId: string, seedKeyword: string): Promise<Keyword[]> {
    this.logger.log(`Discovering keywords for seed: ${seedKeyword}`);

    // Simulate keyword research (in production, integrate with Google Keyword Planner API)
    const relatedKeywords = this.generateRelatedKeywords(seedKeyword);
    const keywords: Keyword[] = [];

    for (const kw of relatedKeywords) {
      const existing = await this.keywordRepository.findOne({
        where: { workspaceId, keyword: kw },
      });

      if (!existing) {
        const keyword = this.keywordRepository.create({
          workspaceId,
          keyword: kw,
          searchVolume: Math.floor(Math.random() * 100000) + 1000,
          cpc: Math.random() * 10 + 0.5,
          competition: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)],
          roasPotential: Math.random() * 5 + 1,
          trendData: Array.from({ length: 12 }, () => Math.random() * 100),
          lastUpdated: new Date(),
        });
        keywords.push(await this.keywordRepository.save(keyword));
      } else {
        keywords.push(existing);
      }
    }

    return keywords;
  }

  private generateRelatedKeywords(seed: string): string[] {
    const variations = ['buy', 'cheap', 'best', 'online', 'affordable', 'quality', 'top'];
    const suffixes = ['near me', 'online', 'store', 'shop', 'sale', 'deals'];
    const related: string[] = [seed];

    variations.forEach(v => related.push(`${v} ${seed}`));
    suffixes.forEach(s => related.push(`${seed} ${s}`));

    return related.slice(0, 100);
  }

  async listKeywords(workspaceId: string, sortBy?: string): Promise<Keyword[]> {
    const order: any = {};
    if (sortBy === 'roasPotential') {
      order.roasPotential = 'DESC';
    } else if (sortBy === 'searchVolume') {
      order.searchVolume = 'DESC';
    } else {
      order.createdAt = 'DESC';
    }

    return this.keywordRepository.find({
      where: { workspaceId },
      order,
      take: 200,
    });
  }

  async generateBiddingRecommendations(workspaceId: string, campaignId?: string): Promise<BiddingRecommendation[]> {
    this.logger.log(`Generating bidding recommendations for workspace ${workspaceId}`);

    const where: any = { workspaceId };
    if (campaignId) where.campaignId = campaignId;

    const recentPerformance = await this.performanceRepository.find({
      where,
      order: { date: 'DESC' },
      take: 1000,
    });

    const recommendations: BiddingRecommendation[] = [];
    const keywordStats = this.aggregateKeywordStats(recentPerformance);

    for (const [keyword, stats] of Object.entries(keywordStats)) {
      const recommendation = this.analyzeKeywordPerformance(workspaceId, campaignId, keyword, stats as any);
      if (recommendation) {
        recommendations.push(await this.recommendationRepository.save(recommendation));
      }
    }

    return recommendations;
  }

  private aggregateKeywordStats(performance: KeywordPerformance[]): Record<string, any> {
    const stats: Record<string, any> = {};

    performance.forEach(p => {
      if (!stats[p.keyword]) {
        stats[p.keyword] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0,
          revenue: 0,
        };
      }
      stats[p.keyword].impressions += p.impressions;
      stats[p.keyword].clicks += p.clicks;
      stats[p.keyword].conversions += p.conversions;
      stats[p.keyword].cost += Number(p.cost);
      stats[p.keyword].revenue += Number(p.revenue);
    });

    return stats;
  }

  private analyzeKeywordPerformance(workspaceId: string, campaignId: string, keyword: string, stats: any): BiddingRecommendation | null {
    const ctr = stats.clicks / stats.impressions;
    const roas = stats.revenue / stats.cost;
    const conversionRate = stats.conversions / stats.clicks;

    // High ROAS - increase bid
    if (roas > 3 && stats.conversions > 10) {
      return this.recommendationRepository.create({
        workspaceId,
        campaignId,
        keyword,
        recommendationType: 'INCREASE_BID',
        currentBid: stats.cost / stats.clicks,
        suggestedBid: (stats.cost / stats.clicks) * 1.3,
        rationale: `High ROAS (${roas.toFixed(2)}x) indicates room to scale. Increasing bid can capture more volume.`,
        predictedImpact: {
          conversions: Math.round(stats.conversions * 1.25),
          roas: roas * 0.95,
        },
        confidenceScore: 85,
        status: 'PENDING',
      });
    }

    // Low ROAS - decrease bid or pause
    if (roas < 1 && stats.cost > 100) {
      return this.recommendationRepository.create({
        workspaceId,
        campaignId,
        keyword,
        recommendationType: stats.conversions === 0 ? 'PAUSE_KEYWORD' : 'DECREASE_BID',
        currentBid: stats.cost / stats.clicks,
        suggestedBid: (stats.cost / stats.clicks) * 0.7,
        rationale: `Low ROAS (${roas.toFixed(2)}x) indicates inefficiency. ${stats.conversions === 0 ? 'Pause' : 'Reduce bid'} to improve profitability.`,
        predictedImpact: {
          cost: stats.cost * 0.7,
          roas: roas * 1.4,
        },
        confidenceScore: 90,
        status: 'PENDING',
      });
    }

    return null;
  }

  async listRecommendations(workspaceId: string, status?: string): Promise<BiddingRecommendation[]> {
    const where: any = { workspaceId };
    if (status) where.status = status;

    return this.recommendationRepository.find({
      where,
      order: { confidenceScore: 'DESC', createdAt: 'DESC' },
      take: 100,
    });
  }

  async applyRecommendation(id: string, userId: string): Promise<BiddingRecommendation> {
    await this.recommendationRepository.update(id, {
      status: 'ACCEPTED',
      appliedAt: new Date(),
      appliedBy: userId,
    });

    const recommendation = await this.recommendationRepository.findOne({ where: { id } });
    this.logger.log(`Applied recommendation ${id}: ${recommendation.recommendationType} for keyword ${recommendation.keyword}`);

    return recommendation;
  }
}
