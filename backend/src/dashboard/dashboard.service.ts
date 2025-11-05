import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Campaign } from '../database/entities/campaign.entity';
import { AICoreClient } from '../services/ai-core.client';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    private aiCoreClient: AICoreClient,
  ) {}

  /**
   * Get high-level KPIs for the dashboard
   */
  async getKpis(period: string) {
    const dateRange = this.parsePeriod(period);
    const campaigns = await this.campaignRepository.find({
      where: {
        date: Between(dateRange.start, dateRange.end),
      },
    });

    const totalInvestment = campaigns.reduce((sum, c) => sum + c.investment, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const avgRoas = totalInvestment > 0 ? totalRevenue / totalInvestment : 0;

    return {
      totalInvestment,
      totalRevenue,
      avgRoas: parseFloat(avgRoas.toFixed(2)),
      totalCampaigns: campaigns.length,
      period,
    };
  }

  /**
   * Get ROAS trends over time for chart visualization
   */
  async getRoasTrends(period: string) {
    const dateRange = this.parsePeriod(period);
    const campaigns = await this.campaignRepository.find({
      where: {
        date: Between(dateRange.start, dateRange.end),
      },
    });

    // Group by platform and calculate daily averages
    const platformData = {
      google: [] as any[],
      meta: [] as any[],
      tiktok: [] as any[],
    };

    // For simplicity, we'll create mock time-series data
    // In production, this would aggregate by actual dates
    const days = this.getDaysInPeriod(period);

    ['google', 'meta', 'tiktok'].forEach(platform => {
      const platformCampaigns = campaigns.filter(c => c.platform === platform);
      const avgRoas = platformCampaigns.length > 0
        ? platformCampaigns.reduce((sum, c) => sum + c.roas, 0) / platformCampaigns.length
        : 0;

      // Generate trend data with slight variations
      for (let i = 0; i < days; i++) {
        const date = new Date(dateRange.end);
        date.setDate(date.getDate() - (days - i - 1));

        const variation = (Math.random() - 0.5) * 0.4; // Random variation ±20%
        const roas = Math.max(0, avgRoas + variation);

        platformData[platform].push({
          date: date.toISOString().split('T')[0],
          roas: parseFloat(roas.toFixed(2)),
        });
      }
    });

    return {
      google: platformData.google,
      meta: platformData.meta,
      tiktok: platformData.tiktok,
    };
  }

  /**
   * Get platform performance summary
   */
  async getPlatformSummary(period: string) {
    const dateRange = this.parsePeriod(period);
    const campaigns = await this.campaignRepository.find({
      where: {
        date: Between(dateRange.start, dateRange.end),
      },
    });

    const platforms = ['google', 'meta', 'tiktok'];
    const summary = platforms.map(platform => {
      const platformCampaigns = campaigns.filter(c => c.platform === platform);

      const investment = platformCampaigns.reduce((sum, c) => sum + c.investment, 0);
      const revenue = platformCampaigns.reduce((sum, c) => sum + c.revenue, 0);
      const roas = investment > 0 ? revenue / investment : 0;

      return {
        platform,
        investment,
        revenue,
        roas: parseFloat(roas.toFixed(2)),
        campaignCount: platformCampaigns.length,
      };
    });

    return summary;
  }

  /**
   * Get top performing campaigns
   */
  async getTopCampaigns(period: string, limit: number = 5) {
    const dateRange = this.parsePeriod(period);
    const campaigns = await this.campaignRepository.find({
      where: {
        date: Between(dateRange.start, dateRange.end),
      },
      order: {
        roas: 'DESC',
      },
      take: limit,
    });

    return campaigns.map(c => ({
      id: c.id,
      name: c.name,
      platform: c.platform,
      investment: c.investment,
      revenue: c.revenue,
      roas: c.roas,
    }));
  }

  /**
   * Get bottom performing campaigns
   */
  async getBottomCampaigns(period: string, limit: number = 5) {
    const dateRange = this.parsePeriod(period);
    const campaigns = await this.campaignRepository.find({
      where: {
        date: Between(dateRange.start, dateRange.end),
      },
      order: {
        roas: 'ASC',
      },
      take: limit,
    });

    return campaigns.map(c => ({
      id: c.id,
      name: c.name,
      platform: c.platform,
      investment: c.investment,
      revenue: c.revenue,
      roas: c.roas,
    }));
  }

  /**
   * Get global AI insight
   */
  getGlobalInsight() {
    return {
      insight: this.aiCoreClient.getGlobalInsight(),
      timestamp: new Date(),
    };
  }

  /**
   * Parse period string to date range
   */
  private parsePeriod(period: string): { start: Date; end: Date } {
    const end = new Date();
    let start = new Date();

    switch (period) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }

    return { start, end };
  }

  /**
   * Get number of days in a period
   */
  private getDaysInPeriod(period: string): number {
    switch (period) {
      case 'today':
        return 1;
      case '7d':
        return 7;
      case '30d':
        return 30;
      case '90d':
        return 90;
      default:
        return 30;
    }
  }
}
