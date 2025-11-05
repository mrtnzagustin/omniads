/**
 * AI Core Client
 * Integrates with real LLM providers (Anthropic Claude or OpenAI)
 * for intelligent recommendation generation.
 *
 * Supports:
 * - Multiple AI providers (Anthropic, OpenAI)
 * - Request caching (1-hour TTL)
 * - Rate limiting (10 requests/hour per workspace)
 * - Error handling with retry logic
 * - Usage tracking and logging
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseLLMProvider } from './ai/providers/base.provider';
import { AnthropicProvider } from './ai/providers/anthropic.provider';
import { OpenAIProvider } from './ai/providers/openai.provider';
import { AICacheService } from './ai/ai-cache.service';
import { AIRequestLog } from '../database/entities/ai-request-log.entity';

export enum RecommendationType {
  PAUSE_CAMPAIGN = 'PAUSE_CAMPAIGN',
  SCALE_CAMPAIGN = 'SCALE_CAMPAIGN',
  BUDGET_SHIFT = 'BUDGET_SHIFT',
  COMPETITOR_PRICE = 'COMPETITOR_PRICE',
  PROMOTE_ORGANIC = 'PROMOTE_ORGANIC',
  CREATE_BUNDLE = 'CREATE_BUNDLE',
}

export interface AIRecommendation {
  type: RecommendationType;
  title: string;
  description: string;
  data: any;
  priority: number;
}

export interface AIAnalysisRequest {
  campaigns: any[];
  products: any[];
  sales: any[];
  merchantData?: any[];
  workspaceId?: string; // Optional workspace ID for caching and rate limiting
}

@Injectable()
export class AICoreClient {
  private provider: BaseLLMProvider;
  private cacheService: AICacheService;
  private requestCounts: Map<string, { count: number; resetAt: Date }> = new Map();
  private maxRequestsPerHour: number;
  private mockMode: boolean;

  constructor(
    @InjectRepository(AIRequestLog)
    private aiRequestLogRepository: Repository<AIRequestLog>,
  ) {
    this.cacheService = new AICacheService();
    this.maxRequestsPerHour = parseInt(process.env.AI_MAX_REQUESTS_PER_HOUR || '10', 10);
    this.mockMode = process.env.AI_MOCK_MODE === 'true';

    if (this.mockMode) {
      console.log('[AICoreClient] Running in MOCK MODE - using hardcoded recommendations');
      return;
    }

    // Initialize provider based on configuration
    const providerType = process.env.AI_PROVIDER || 'anthropic';

    try {
      if (providerType === 'anthropic') {
        this.provider = new AnthropicProvider();
      } else if (providerType === 'openai') {
        this.provider = new OpenAIProvider();
      } else {
        throw new Error(`Unknown AI provider: ${providerType}`);
      }

      console.log(`[AICoreClient] Initialized with provider: ${this.provider.getProviderName()}`);
    } catch (error) {
      console.error('[AICoreClient] Failed to initialize AI provider:', error.message);
      console.warn('[AICoreClient] Falling back to MOCK MODE');
      this.mockMode = true;
    }
  }

  /**
   * Check rate limit for a workspace
   */
  private checkRateLimit(workspaceId: string): void {
    if (!workspaceId) return; // Skip rate limiting if no workspace ID

    const now = new Date();
    const record = this.requestCounts.get(workspaceId);

    // Reset if hour has passed
    if (!record || now > record.resetAt) {
      this.requestCounts.set(workspaceId, {
        count: 1,
        resetAt: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
      });
      return;
    }

    // Check if limit exceeded
    if (record.count >= this.maxRequestsPerHour) {
      const retryAfter = Math.ceil((record.resetAt.getTime() - now.getTime()) / 1000);
      throw new Error(
        `Rate limit exceeded for workspace ${workspaceId}. Max ${this.maxRequestsPerHour} requests per hour. Retry after ${retryAfter} seconds.`,
      );
    }

    // Increment count
    record.count++;
  }

  /**
   * Log AI request for tracking and cost monitoring
   */
  private async logRequest(
    workspaceId: string,
    provider: string,
    model: string,
    requestType: string,
    latencyMs: number,
    success: boolean,
    usage?: { promptTokens: number; completionTokens: number; totalTokens: number },
    errorMessage?: string,
  ): Promise<void> {
    try {
      const log = this.aiRequestLogRepository.create({
        workspaceId,
        provider,
        model,
        requestType,
        latencyMs,
        success,
        promptTokens: usage?.promptTokens,
        completionTokens: usage?.completionTokens,
        totalTokens: usage?.totalTokens,
        errorMessage,
      });

      await this.aiRequestLogRepository.save(log);
    } catch (error) {
      console.error('[AICoreClient] Failed to log AI request:', error);
      // Don't throw - logging failures shouldn't break the main flow
    }
  }

  /**
   * Analyzes campaign and sales data to generate recommendations
   */
  async generateRecommendations(request: AIAnalysisRequest): Promise<AIRecommendation[]> {
    const workspaceId = request.workspaceId || 'default';
    const startTime = Date.now();

    // Check cache first
    const cached = this.cacheService.get(workspaceId);
    if (cached) {
      console.log(`[AICoreClient] Returning ${cached.length} cached recommendations`);
      return cached;
    }

    // If mock mode, return hardcoded recommendations
    if (this.mockMode) {
      return this.generateMockRecommendations();
    }

    try {
      // Check rate limit
      this.checkRateLimit(workspaceId);

      // Call AI provider
      const { recommendations, usage } = await this.provider.generateRecommendations(request);

      // Cache results
      this.cacheService.set(workspaceId, recommendations);

      // Log request
      const latencyMs = Date.now() - startTime;
      await this.logRequest(
        workspaceId,
        this.provider.getProviderName(),
        this.provider.getModelName(),
        'recommendations',
        latencyMs,
        true,
        usage,
      );

      return recommendations;
    } catch (error) {
      console.error('[AICoreClient] Error generating recommendations:', error);

      // Log failure
      const latencyMs = Date.now() - startTime;
      await this.logRequest(
        workspaceId,
        this.provider?.getProviderName() || 'unknown',
        this.provider?.getModelName() || 'unknown',
        'recommendations',
        latencyMs,
        false,
        undefined,
        error.message,
      );

      // Try to return cached data as fallback
      const cachedFallback = this.cacheService.get(workspaceId);
      if (cachedFallback) {
        console.warn('[AICoreClient] Returning cached recommendations as fallback after error');
        return cachedFallback;
      }

      // If no cache available, return mock recommendations as last resort
      console.warn('[AICoreClient] No cache available, returning mock recommendations as fallback');
      return this.generateMockRecommendations();
    }
  }

  /**
   * Generates a daily summary for WhatsApp notifications
   */
  async generateDailySummary(recommendations: AIRecommendation[]): Promise<string> {
    if (this.mockMode) {
      return this.generateMockDailySummary(recommendations);
    }

    const startTime = Date.now();

    try {
      const { summary, usage } = await this.provider.generateDailySummary(recommendations);

      // Log request
      const latencyMs = Date.now() - startTime;
      await this.logRequest(
        'system',
        this.provider.getProviderName(),
        this.provider.getModelName(),
        'summary',
        latencyMs,
        true,
        usage,
      );

      return summary;
    } catch (error) {
      console.error('[AICoreClient] Error generating daily summary:', error);

      // Log failure
      const latencyMs = Date.now() - startTime;
      await this.logRequest(
        'system',
        this.provider?.getProviderName() || 'unknown',
        this.provider?.getModelName() || 'unknown',
        'summary',
        latencyMs,
        false,
        undefined,
        error.message,
      );

      // Fallback to mock summary
      return this.generateMockDailySummary(recommendations);
    }
  }

  /**
   * Generates global AI insight for dashboard
   */
  getGlobalInsight(campaigns?: any[]): string {
    if (this.mockMode || !campaigns) {
      return 'Global Insight: Google Ads remains the most profitable channel (ROAS 4.5x), while Meta Ads requires urgent review (ROAS 0.8x on underperforming campaigns). Consider reallocating 40% of Meta budget to high-performing Google Shopping campaigns.';
    }

    // For now, return sync version for backward compatibility
    // TODO: Make this async in consuming services
    return 'Global insight generation in progress...';
  }

  /**
   * Async version of getGlobalInsight
   */
  async getGlobalInsightAsync(campaigns: any[]): Promise<string> {
    if (this.mockMode) {
      return this.getGlobalInsight();
    }

    const startTime = Date.now();

    try {
      const { insight, usage } = await this.provider.getGlobalInsight(campaigns);

      // Log request
      const latencyMs = Date.now() - startTime;
      await this.logRequest(
        'system',
        this.provider.getProviderName(),
        this.provider.getModelName(),
        'insight',
        latencyMs,
        true,
        usage,
      );

      return insight;
    } catch (error) {
      console.error('[AICoreClient] Error generating global insight:', error);

      // Log failure
      const latencyMs = Date.now() - startTime;
      await this.logRequest(
        'system',
        this.provider?.getProviderName() || 'unknown',
        this.provider?.getModelName() || 'unknown',
        'insight',
        latencyMs,
        false,
        undefined,
        error.message,
      );

      // Fallback to default insight
      return this.getGlobalInsight();
    }
  }

  /**
   * MOCK MODE: Generate hardcoded recommendations (backward compatibility)
   */
  private generateMockRecommendations(): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    recommendations.push({
      type: RecommendationType.PAUSE_CAMPAIGN,
      title: '⚠️ Pause "Reels Noche - TikTok" Campaign',
      description:
        'This Meta campaign is underperforming with a ROAS of 0.8x. Low sales correlation detected with a negative performance trend over the last 7 days.',
      data: {
        campaignId: 'meta_002',
        campaignName: 'Reels Noche - TikTok',
        platform: 'meta',
        currentRoas: 0.8,
        investment: 50000,
        revenue: 40000,
        trend: 'negative',
        reason: 'ROAS below 1.0x threshold, poor sales correlation',
      },
      priority: 10,
    });

    recommendations.push({
      type: RecommendationType.SCALE_CAMPAIGN,
      title: '🚀 Increase Budget for "Saco Lino - Google Shopping"',
      description:
        'This campaign is a top performer with ROAS 4.5x and conversion rate of 7.8% (vs 2.1% average). Recommend increasing daily budget by 50% to capitalize on performance.',
      data: {
        campaignId: 'google_001',
        campaignName: 'Saco Lino - Google Shopping',
        platform: 'google',
        currentRoas: 4.5,
        investment: 60000,
        revenue: 270000,
        conversionRate: 7.8,
        avgConversionRate: 2.1,
        recommendedBudgetIncrease: 50,
        trend: 'positive',
      },
      priority: 9,
    });

    recommendations.push({
      type: RecommendationType.BUDGET_SHIFT,
      title: '💸 Shift Budget from Meta to Google Ads',
      description:
        'AI detected opportunity to reallocate $50,000 from underperforming Meta campaign "Reels Noche" (ROAS 0.8x) to Google Shopping campaigns (avg ROAS 4.2x).',
      data: {
        fromCampaign: 'Reels Noche - TikTok',
        fromPlatform: 'meta',
        fromRoas: 0.8,
        toPlatform: 'google',
        toRoas: 4.2,
        suggestedAmount: 50000,
        projectedRevenueIncrease: 160000,
      },
      priority: 8,
    });

    recommendations.push({
      type: RecommendationType.COMPETITOR_PRICE,
      title: '💰 Competitor Price Drop Alert: Tapado Paño Gris',
      description:
        'Competitor "Kosiuko" launched a 25% OFF promotion on "Tapado Paño Gris". Our price is now 15% higher. ROAS for this product has dropped 40% in the last 24h. Evaluate counter-offer.',
      data: {
        productId: 'prod_001',
        productName: 'Tapado Paño Gris',
        ourPrice: 89990,
        competitorPrice: 74990,
        competitorName: 'Kosiuko',
        priceDifference: 15,
        roasImpact: -40,
        timeframe: '24h',
      },
      priority: 9,
    });

    recommendations.push({
      type: RecommendationType.PROMOTE_ORGANIC,
      title: '🌟 Promote High-Converting Organic Product',
      description:
        'Product "Vestido Lino Crudo" has an exceptional 9.1% organic conversion rate but receives minimal ad spend. Recommend creating a new promotional campaign.',
      data: {
        productId: 'tn_prod_001',
        productName: 'Vestido Lino Crudo',
        organicConversionRate: 9.1,
        avgConversionRate: 3.2,
        currentAdSpend: 0,
        organicRevenue: 105980,
        projectedRoasWithAds: 5.2,
      },
      priority: 7,
    });

    recommendations.push({
      type: RecommendationType.CREATE_BUNDLE,
      title: '🎁 Bundle Opportunity Detected',
      description:
        'AI detected that 38% of purchases for "Jean Mom Celeste" also include "Remera Básica Blanca". Create a bundle promotion to increase average order value.',
      data: {
        product1: 'Jean Mom Celeste',
        product2: 'Remera Básica Blanca',
        coOccurrenceRate: 38,
        individualPrice1: 45990,
        individualPrice2: 18990,
        suggestedBundlePrice: 58990,
        suggestedDiscount: 10,
        projectedAovIncrease: 22,
      },
      priority: 6,
    });

    console.log(`[AICoreClient MOCK] Generated ${recommendations.length} recommendations`);
    return recommendations;
  }

  /**
   * MOCK MODE: Generate mock daily summary
   */
  private generateMockDailySummary(recommendations: AIRecommendation[]): string {
    const highPriority = recommendations.filter((r) => r.priority >= 8);

    let summary = "📊 Today's Top Action Items:\n\n";

    highPriority.slice(0, 3).forEach((rec, index) => {
      summary += `${index + 1}. ${rec.title}\n`;
    });

    summary += `\n🎯 Total Recommendations: ${recommendations.length}`;

    return summary;
  }
}
