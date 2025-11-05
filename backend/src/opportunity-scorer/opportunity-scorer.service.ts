import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OpportunityScore,
  ScoreBreakdown,
  ScoreCategory,
  ScoreRecommendation,
} from '../database/entities/opportunity-score.entity';
import {
  PlatformOpportunityAggregate,
  PlatformScoreStats,
} from '../database/entities/platform-opportunity-aggregate.entity';
import { Campaign } from '../database/entities/campaign.entity';

interface ScoringResult {
  score: OpportunityScore;
  insights: string[];
}

@Injectable()
export class OpportunityScorerService {
  private readonly logger = new Logger(OpportunityScorerService.name);

  constructor(
    @InjectRepository(OpportunityScore)
    private opportunityScoreRepo: Repository<OpportunityScore>,
    @InjectRepository(PlatformOpportunityAggregate)
    private aggregateRepo: Repository<PlatformOpportunityAggregate>,
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,
  ) {}

  /**
   * Calculate opportunity score for a single campaign
   */
  async scoreCampaign(campaignId: string): Promise<ScoringResult> {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    const breakdown = this.calculateBreakdown(campaign);
    const totalScore = this.calculateTotalScore(breakdown);
    const category = this.determineCategory(totalScore);
    const recommendations = this.generateRecommendations(campaign, breakdown);
    const summary = this.generateSummary(campaign, totalScore, recommendations);

    // Get benchmark data
    const { industryAverage, topPerformerScore } =
      await this.getBenchmarks(campaign);

    const score = this.opportunityScoreRepo.create({
      campaignId,
      campaign,
      totalScore,
      category,
      breakdown,
      recommendations,
      summary,
      industryAverage,
      topPerformerScore,
      version: 1,
    });

    await this.opportunityScoreRepo.save(score);

    const insights = this.generateInsights(score);

    this.logger.log(
      `Scored campaign ${campaignId}: ${totalScore}/100 (${category})`,
    );

    return { score, insights };
  }

  /**
   * Calculate score breakdown by category
   */
  private calculateBreakdown(campaign: Campaign): ScoreBreakdown {
    return {
      targeting: this.scoreTargeting(campaign),
      budget: this.scoreBudget(campaign),
      creative: this.scoreCreative(campaign),
      bidding: this.scoreBidding(campaign),
      optimization: this.scoreOptimization(campaign),
    };
  }

  /**
   * Score targeting setup (0-20 points)
   */
  private scoreTargeting(campaign: Campaign): number {
    let score = 20;

    // Deduct points for missing or weak targeting
    if (!campaign.targetAudience || campaign.targetAudience.length === 0) {
      score -= 10; // No audience targeting
    }

    if (!campaign.geoTargeting || campaign.geoTargeting.length === 0) {
      score -= 5; // No geo targeting
    }

    // Bonus for using advanced targeting
    if (campaign.targetAudience && campaign.targetAudience.includes('lookalike')) {
      score = Math.min(20, score + 2);
    }

    return Math.max(0, score);
  }

  /**
   * Score budget setup (0-20 points)
   */
  private scoreBudget(campaign: Campaign): number {
    let score = 20;

    // Check if budget is set
    if (!campaign.budget || campaign.budget <= 0) {
      score -= 15;
    }

    // Check if budget is too low (less than platform minimum)
    if (campaign.budget > 0 && campaign.budget < 10) {
      score -= 5; // Budget too low
    }

    // Check if budget is too high without proven performance
    if (campaign.budget > 1000 && campaign.roas < 1.5) {
      score -= 3; // High spend with poor ROAS
    }

    // Bonus for appropriate budget allocation
    if (campaign.budget >= 50 && campaign.budget <= 500) {
      score = Math.min(20, score + 2);
    }

    return Math.max(0, score);
  }

  /**
   * Score creative setup (0-20 points)
   */
  private scoreCreative(campaign: Campaign): number {
    let score = 20;

    // Check creative variety (assumes creative count in metadata)
    const creativeCount = campaign.adSets?.length || 0;

    if (creativeCount === 0) {
      score -= 15; // No creatives
    } else if (creativeCount === 1) {
      score -= 5; // Only one creative (no testing)
    } else if (creativeCount >= 3) {
      score = Math.min(20, score + 3); // Good variety
    }

    return Math.max(0, score);
  }

  /**
   * Score bidding strategy (0-20 points)
   */
  private scoreBidding(campaign: Campaign): number {
    let score = 20;

    // For now, use platform defaults as baseline
    // In production, this would check actual bidding strategy configuration

    // Penalize if CPC is too high relative to industry average
    const avgCPC = campaign.spent / (campaign.clicks || 1);
    if (avgCPC > 5) {
      score -= 5; // CPC too high
    }

    // Bonus for good performance
    if (campaign.roas >= 3) {
      score = Math.min(20, score + 3);
    }

    return Math.max(0, score);
  }

  /**
   * Score optimization settings (0-20 points)
   */
  private scoreOptimization(campaign: Campaign): number {
    let score = 20;

    // Check if campaign is optimizing for the right metric
    if (campaign.objective !== 'conversions' && campaign.objective !== 'sales') {
      score -= 5; // Not optimizing for conversions
    }

    // Check if campaign has conversion tracking
    if (!campaign.conversionTracking || campaign.conversions === 0) {
      score -= 10; // No conversion tracking
    }

    // Check if campaign is active
    if (campaign.status !== 'active') {
      score -= 3; // Inactive campaign
    }

    return Math.max(0, score);
  }

  /**
   * Calculate total score from breakdown
   */
  private calculateTotalScore(breakdown: ScoreBreakdown): number {
    return (
      breakdown.targeting +
      breakdown.budget +
      breakdown.creative +
      breakdown.bidding +
      breakdown.optimization
    );
  }

  /**
   * Determine category based on total score
   */
  private determineCategory(totalScore: number): ScoreCategory {
    if (totalScore >= 90) return ScoreCategory.EXCELLENT;
    if (totalScore >= 70) return ScoreCategory.GOOD;
    if (totalScore >= 50) return ScoreCategory.FAIR;
    return ScoreCategory.POOR;
  }

  /**
   * Generate recommendations based on score breakdown
   */
  private generateRecommendations(
    campaign: Campaign,
    breakdown: ScoreBreakdown,
  ): ScoreRecommendation[] {
    const recommendations: ScoreRecommendation[] = [];

    // Targeting recommendations
    if (breakdown.targeting < 15) {
      recommendations.push({
        category: 'targeting',
        issue: 'Weak audience targeting',
        recommendation:
          'Add lookalike audiences or interest-based targeting to reach more qualified users',
        potentialImpact: 'high',
        estimatedImprovement: 10,
      });
    }

    // Budget recommendations
    if (breakdown.budget < 15) {
      recommendations.push({
        category: 'budget',
        issue: 'Budget optimization needed',
        recommendation:
          campaign.budget < 10
            ? 'Increase daily budget to at least $10 for better delivery'
            : 'Optimize budget allocation based on performance data',
        potentialImpact: 'high',
        estimatedImprovement: 8,
      });
    }

    // Creative recommendations
    if (breakdown.creative < 15) {
      recommendations.push({
        category: 'creative',
        issue: 'Limited creative variety',
        recommendation:
          'Add at least 3 creative variants to test different messaging and visuals',
        potentialImpact: 'medium',
        estimatedImprovement: 7,
      });
    }

    // Bidding recommendations
    if (breakdown.bidding < 15) {
      recommendations.push({
        category: 'bidding',
        issue: 'Bidding strategy needs optimization',
        recommendation:
          'Consider switching to automated bidding strategies like Target ROAS',
        potentialImpact: 'medium',
        estimatedImprovement: 6,
      });
    }

    // Optimization recommendations
    if (breakdown.optimization < 15) {
      recommendations.push({
        category: 'optimization',
        issue: 'Conversion optimization not configured',
        recommendation:
          'Set up conversion tracking and optimize for conversions or sales',
        potentialImpact: 'high',
        estimatedImprovement: 12,
      });
    }

    return recommendations.sort(
      (a, b) => b.estimatedImprovement - a.estimatedImprovement,
    );
  }

  /**
   * Generate summary text
   */
  private generateSummary(
    campaign: Campaign,
    totalScore: number,
    recommendations: ScoreRecommendation[],
  ): string {
    const category = this.determineCategory(totalScore);
    const topIssue = recommendations[0];

    if (category === ScoreCategory.EXCELLENT) {
      return `Campaign "${campaign.name}" is performing excellently with a score of ${totalScore}/100. Minor optimizations available.`;
    }

    if (category === ScoreCategory.GOOD) {
      return `Campaign "${campaign.name}" has a good setup (${totalScore}/100). Focus on ${topIssue?.category || 'optimization'} to reach excellence.`;
    }

    if (category === ScoreCategory.FAIR) {
      return `Campaign "${campaign.name}" needs improvement (${totalScore}/100). Top priority: ${topIssue?.issue || 'general optimization'}.`;
    }

    return `Campaign "${campaign.name}" requires immediate attention (${totalScore}/100). Critical issues found in ${recommendations.length} areas.`;
  }

  /**
   * Generate actionable insights
   */
  private generateInsights(score: OpportunityScore): string[] {
    const insights: string[] = [];

    if (score.totalScore < score.industryAverage) {
      insights.push(
        `Score is ${(score.industryAverage - score.totalScore).toFixed(1)} points below industry average`,
      );
    }

    if (score.totalScore < score.topPerformerScore) {
      insights.push(
        `Top performers score ${score.topPerformerScore}/100. You could improve by ${(score.topPerformerScore - score.totalScore).toFixed(1)} points`,
      );
    }

    const potentialGain = score.recommendations.reduce(
      (sum, r) => sum + r.estimatedImprovement,
      0,
    );
    if (potentialGain > 0) {
      insights.push(
        `Implementing all recommendations could improve score by up to ${potentialGain} points`,
      );
    }

    return insights;
  }

  /**
   * Get benchmark data
   */
  private async getBenchmarks(
    campaign: Campaign,
  ): Promise<{ industryAverage: number; topPerformerScore: number }> {
    // In production, this would query actual benchmark data
    // For now, return realistic defaults
    return {
      industryAverage: 72,
      topPerformerScore: 92,
    };
  }

  /**
   * Score all campaigns for a platform
   */
  async scorePlatformCampaigns(platform: string): Promise<ScoringResult[]> {
    const campaigns = await this.campaignRepo.find({
      where: { platform },
    });

    const results: ScoringResult[] = [];

    for (const campaign of campaigns) {
      try {
        const result = await this.scoreCampaign(campaign.id);
        results.push(result);
      } catch (error) {
        this.logger.error(
          `Failed to score campaign ${campaign.id}: ${error.message}`,
        );
      }
    }

    // Update aggregate
    await this.updatePlatformAggregate(platform, results);

    return results;
  }

  /**
   * Update platform aggregate stats
   */
  private async updatePlatformAggregate(
    platform: string,
    results: ScoringResult[],
  ): Promise<void> {
    if (results.length === 0) return;

    const scores = results.map((r) => r.score);
    const averageScore =
      scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length;

    const stats: PlatformScoreStats = {
      averageScore,
      campaignCount: scores.length,
      excellentCount: scores.filter((s) => s.category === ScoreCategory.EXCELLENT)
        .length,
      goodCount: scores.filter((s) => s.category === ScoreCategory.GOOD).length,
      fairCount: scores.filter((s) => s.category === ScoreCategory.FAIR).length,
      poorCount: scores.filter((s) => s.category === ScoreCategory.POOR).length,
      topIssues: this.calculateTopIssues(scores),
    };

    const aggregate = this.aggregateRepo.create({
      platform,
      overallScore: averageScore,
      stats,
      calculatedFor: new Date(),
    });

    await this.aggregateRepo.save(aggregate);

    this.logger.log(
      `Updated ${platform} aggregate: ${averageScore.toFixed(1)}/100 across ${scores.length} campaigns`,
    );
  }

  /**
   * Calculate top issues across campaigns
   */
  private calculateTopIssues(
    scores: OpportunityScore[],
  ): Array<{ issue: string; frequency: number }> {
    const issueMap = new Map<string, number>();

    for (const score of scores) {
      for (const rec of score.recommendations) {
        const current = issueMap.get(rec.issue) || 0;
        issueMap.set(rec.issue, current + 1);
      }
    }

    return Array.from(issueMap.entries())
      .map(([issue, frequency]) => ({ issue, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  /**
   * Get opportunity score for a campaign
   */
  async getScore(campaignId: string): Promise<OpportunityScore | null> {
    return this.opportunityScoreRepo.findOne({
      where: { campaignId },
      relations: ['campaign'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get platform aggregate
   */
  async getPlatformAggregate(
    platform: string,
  ): Promise<PlatformOpportunityAggregate | null> {
    return this.aggregateRepo.findOne({
      where: { platform },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all scores for comparison
   */
  async getAllScores(): Promise<OpportunityScore[]> {
    return this.opportunityScoreRepo.find({
      relations: ['campaign'],
      order: { totalScore: 'DESC' },
    });
  }
}
