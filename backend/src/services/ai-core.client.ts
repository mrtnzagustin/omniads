/**
 * AI Core Client (MOCKED)
 * This simulates communication with the external Python AI Core microservice
 * that uses LangChain/LangGraph for intelligent recommendation generation.
 *
 * In production, this would make HTTP POST requests to the Python service.
 * For MVP, this returns realistic, hardcoded recommendation data.
 */

import { Injectable } from '@nestjs/common';
import { RecommendationType } from '../database/entities/recommendation.entity';

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
}

@Injectable()
export class AICoreClient {
  private readonly aiCoreUrl: string;

  constructor() {
    this.aiCoreUrl = process.env.AI_CORE_URL || 'http://localhost:8000';
  }

  /**
   * Analyzes campaign and sales data to generate recommendations
   * In production: POST to {aiCoreUrl}/api/analyze
   * For MVP: Returns mocked recommendations
   */
  async generateRecommendations(request: AIAnalysisRequest): Promise<AIRecommendation[]> {
    // Simulate network delay to AI Core service
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('[AI CORE MOCK] Analyzing data and generating recommendations...');

    // Simulate LangChain/LangGraph AI analysis output
    const recommendations: AIRecommendation[] = [];

    // RECOMMENDATION 1: PAUSE underperforming campaign
    recommendations.push({
      type: RecommendationType.PAUSE_CAMPAIGN,
      title: '⚠️ Pause "Reels Noche - TikTok" Campaign',
      description: 'This Meta campaign is underperforming with a ROAS of 0.8x. Low sales correlation detected with a negative performance trend over the last 7 days.',
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

    // RECOMMENDATION 2: SCALE high-performing campaign
    recommendations.push({
      type: RecommendationType.SCALE_CAMPAIGN,
      title: '🚀 Increase Budget for "Saco Lino - Google Shopping"',
      description: 'This campaign is a top performer with ROAS 4.5x and conversion rate of 7.8% (vs 2.1% average). Recommend increasing daily budget by 50% to capitalize on performance.',
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

    // RECOMMENDATION 3: BUDGET SHIFT cross-platform
    recommendations.push({
      type: RecommendationType.BUDGET_SHIFT,
      title: '💸 Shift Budget from Meta to Google Ads',
      description: 'AI detected opportunity to reallocate $50,000 from underperforming Meta campaign "Reels Noche" (ROAS 0.8x) to Google Shopping campaigns (avg ROAS 4.2x).',
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

    // RECOMMENDATION 4: COMPETITOR PRICE alert
    recommendations.push({
      type: RecommendationType.COMPETITOR_PRICE,
      title: '💰 Competitor Price Drop Alert: Tapado Paño Gris',
      description: 'Competitor "Kosiuko" launched a 25% OFF promotion on "Tapado Paño Gris". Our price is now 15% higher. ROAS for this product has dropped 40% in the last 24h. Evaluate counter-offer.',
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

    // RECOMMENDATION 5: PROMOTE ORGANIC winner
    recommendations.push({
      type: RecommendationType.PROMOTE_ORGANIC,
      title: '🌟 Promote High-Converting Organic Product',
      description: 'Product "Vestido Lino Crudo" has an exceptional 9.1% organic conversion rate but receives minimal ad spend. Recommend creating a new promotional campaign.',
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

    // RECOMMENDATION 6: CREATE BUNDLE opportunity
    recommendations.push({
      type: RecommendationType.CREATE_BUNDLE,
      title: '🎁 Bundle Opportunity Detected',
      description: 'AI detected that 38% of purchases for "Jean Mom Celeste" also include "Remera Básica Blanca". Create a bundle promotion to increase average order value.',
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

    console.log(`[AI CORE MOCK] Generated ${recommendations.length} recommendations`);
    return recommendations;
  }

  /**
   * Generates a daily summary for WhatsApp notifications
   */
  async generateDailySummary(recommendations: AIRecommendation[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const highPriority = recommendations.filter(r => r.priority >= 8);

    let summary = '📊 Today\'s Top Action Items:\n\n';

    highPriority.slice(0, 3).forEach((rec, index) => {
      summary += `${index + 1}. ${rec.title}\n`;
    });

    summary += `\n🎯 Total Recommendations: ${recommendations.length}`;

    return summary;
  }

  /**
   * Generates global AI insight for dashboard
   */
  getGlobalInsight(): string {
    return 'Global Insight: Google Ads remains the most profitable channel (ROAS 4.5x), while Meta Ads requires urgent review (ROAS 0.8x on underperforming campaigns). Consider reallocating 40% of Meta budget to high-performing Google Shopping campaigns.';
  }
}
