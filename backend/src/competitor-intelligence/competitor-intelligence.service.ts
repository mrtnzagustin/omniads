import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan, In } from 'typeorm';
import { Competitor } from '../database/entities/competitor.entity';
import { CompetitorAd } from '../database/entities/competitor-ad.entity';
import { CompetitorSpendEstimate } from '../database/entities/competitor-spend-estimate.entity';
import { CompetitorAlert } from '../database/entities/competitor-alert.entity';
import * as crypto from 'crypto';

export interface CreateCompetitorDto {
  workspaceId: string;
  name: string;
  domain?: string;
  facebookPageId?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeChannelId?: string;
  description?: string;
  addedBy?: string;
}

export interface UpdateCompetitorDto {
  name?: string;
  domain?: string;
  facebookPageId?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeChannelId?: string;
  description?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
}

export interface CreateCompetitorAdDto {
  competitorId: string;
  platform: string;
  externalAdId: string;
  creativeUrl?: string;
  thumbnailUrl?: string;
  adCopy?: string;
  headline?: string;
  description?: string;
  callToAction?: string;
  landingPageUrl?: string;
  format?: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'COLLECTION' | 'TEXT' | 'OTHER';
  firstSeenDate: Date;
  lastSeenDate: Date;
  estimatedImpressions?: number;
  platformMetadata?: Record<string, any>;
}

export interface CreateCompetitorAlertDto {
  workspaceId: string;
  competitorId: string;
  name: string;
  alertType: 'NEW_ADS_LAUNCHED' | 'SPEND_INCREASE' | 'SPEND_DECREASE' | 'LONG_RUNNING_AD' | 'AD_REMOVED';
  threshold: {
    value: number;
    unit: string;
    timeWindow?: string;
  };
  notificationChannels: {
    email?: boolean;
    whatsapp?: boolean;
    slack?: boolean;
    inApp?: boolean;
  };
  recipients?: string[];
  createdBy?: string;
}

@Injectable()
export class CompetitorIntelligenceService {
  private readonly logger = new Logger(CompetitorIntelligenceService.name);

  constructor(
    @InjectRepository(Competitor)
    private competitorRepository: Repository<Competitor>,
    @InjectRepository(CompetitorAd)
    private competitorAdRepository: Repository<CompetitorAd>,
    @InjectRepository(CompetitorSpendEstimate)
    private spendEstimateRepository: Repository<CompetitorSpendEstimate>,
    @InjectRepository(CompetitorAlert)
    private competitorAlertRepository: Repository<CompetitorAlert>,
  ) {}

  // Competitor Management
  async createCompetitor(dto: CreateCompetitorDto): Promise<Competitor> {
    this.logger.log(`Creating competitor: ${dto.name} for workspace ${dto.workspaceId}`);

    const competitor = this.competitorRepository.create(dto);
    const saved = await this.competitorRepository.save(competitor);

    // Queue discovery job (in production, this would trigger a background job)
    await this.queueAdDiscovery(saved.id);

    return saved;
  }

  async listCompetitors(workspaceId: string, status?: string): Promise<any[]> {
    const where: any = { workspaceId };
    if (status) {
      where.status = status;
    }

    const competitors = await this.competitorRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    // Enrich with stats
    const enriched = await Promise.all(
      competitors.map(async (competitor) => {
        const stats = await this.getCompetitorStats(competitor.id);
        return {
          ...competitor,
          ...stats,
        };
      }),
    );

    return enriched;
  }

  async getCompetitor(id: string): Promise<Competitor> {
    const competitor = await this.competitorRepository.findOne({ where: { id } });
    if (!competitor) {
      throw new Error(`Competitor ${id} not found`);
    }
    return competitor;
  }

  async updateCompetitor(id: string, dto: UpdateCompetitorDto): Promise<Competitor> {
    await this.competitorRepository.update(id, dto);
    return this.getCompetitor(id);
  }

  async deleteCompetitor(id: string): Promise<void> {
    await this.competitorRepository.delete(id);
  }

  private async getCompetitorStats(competitorId: string): Promise<any> {
    const totalAds = await this.competitorAdRepository.count({
      where: { competitorId },
    });

    const activeAds = await this.competitorAdRepository.count({
      where: { competitorId, status: 'ACTIVE' },
    });

    const longRunningAds = await this.competitorAdRepository.count({
      where: { competitorId, isLongRunning: true, status: 'ACTIVE' },
    });

    // Get latest spend estimate
    const latestSpend = await this.spendEstimateRepository.findOne({
      where: { competitorId, platform: 'TOTAL' },
      order: { month: 'DESC' },
    });

    return {
      totalAds,
      activeAds,
      longRunningAds,
      estimatedMonthlySpend: latestSpend
        ? {
            min: latestSpend.estimatedSpendMin,
            max: latestSpend.estimatedSpendMax,
            mid: latestSpend.estimatedSpendMid,
          }
        : null,
    };
  }

  // Ad Discovery & Management
  async discoverAdsForCompetitor(competitorId: string): Promise<CompetitorAd[]> {
    this.logger.log(`Discovering ads for competitor ${competitorId}`);

    const competitor = await this.getCompetitor(competitorId);
    const discoveredAds: CompetitorAd[] = [];

    // Simulate ad discovery from various platforms
    // In production, this would call actual APIs (Meta Ad Library, etc.)

    if (competitor.facebookPageId) {
      const metaAds = await this.discoverMetaAds(competitor.facebookPageId);
      discoveredAds.push(...metaAds);
    }

    if (competitor.domain) {
      const googleAds = await this.discoverGoogleAds(competitor.domain);
      discoveredAds.push(...googleAds);
    }

    if (competitor.tiktokHandle) {
      const tiktokAds = await this.discoverTikTokAds(competitor.tiktokHandle);
      discoveredAds.push(...tiktokAds);
    }

    // Save discovered ads
    const saved = await this.saveDiscoveredAds(competitorId, discoveredAds);

    // Update competitor's last scanned timestamp
    await this.competitorRepository.update(competitorId, {
      lastScannedAt: new Date(),
    });

    // Check for alerts
    await this.checkAndTriggerAlerts(competitorId);

    return saved;
  }

  private async discoverMetaAds(pageId: string): Promise<any[]> {
    // Simulated Meta Ad Library discovery
    // In production, integrate with Meta Ad Library API
    this.logger.log(`Discovering Meta ads for page ${pageId}`);

    const mockAds = [];
    const numAds = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < numAds; i++) {
      mockAds.push({
        platform: 'META',
        externalAdId: `meta_${pageId}_${Date.now()}_${i}`,
        format: ['IMAGE', 'VIDEO', 'CAROUSEL'][Math.floor(Math.random() * 3)],
        headline: `Sample Meta Ad Headline ${i + 1}`,
        description: `This is a sample Meta ad description for testing purposes.`,
        adCopy: `Discover amazing products and services. Limited time offer!`,
        callToAction: ['SHOP_NOW', 'LEARN_MORE', 'SIGN_UP'][Math.floor(Math.random() * 3)],
        landingPageUrl: `https://example.com/landing-${i}`,
        firstSeenDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        lastSeenDate: new Date(),
        estimatedImpressions: Math.floor(Math.random() * 100000) + 10000,
      });
    }

    return mockAds;
  }

  private async discoverGoogleAds(domain: string): Promise<any[]> {
    // Simulated Google Ads discovery
    this.logger.log(`Discovering Google ads for domain ${domain}`);

    const mockAds = [];
    const numAds = Math.floor(Math.random() * 8) + 3;

    for (let i = 0; i < numAds; i++) {
      mockAds.push({
        platform: 'GOOGLE',
        externalAdId: `google_${domain.replace(/\./g, '_')}_${Date.now()}_${i}`,
        format: ['TEXT', 'IMAGE', 'VIDEO'][Math.floor(Math.random() * 3)],
        headline: `Google Ad Headline ${i + 1}`,
        description: `Google ad description text for testing.`,
        adCopy: `Find the best deals on ${domain}`,
        callToAction: 'LEARN_MORE',
        landingPageUrl: `https://${domain}/ad-${i}`,
        firstSeenDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
        lastSeenDate: new Date(),
        estimatedImpressions: Math.floor(Math.random() * 50000) + 5000,
      });
    }

    return mockAds;
  }

  private async discoverTikTokAds(handle: string): Promise<any[]> {
    // Simulated TikTok ad discovery
    this.logger.log(`Discovering TikTok ads for handle ${handle}`);

    const mockAds = [];
    const numAds = Math.floor(Math.random() * 6) + 2;

    for (let i = 0; i < numAds; i++) {
      mockAds.push({
        platform: 'TIKTOK',
        externalAdId: `tiktok_${handle}_${Date.now()}_${i}`,
        format: 'VIDEO',
        headline: `TikTok Video Ad ${i + 1}`,
        description: `Engaging TikTok ad content`,
        adCopy: `Check out this amazing content! #ad #sponsored`,
        callToAction: 'WATCH_NOW',
        landingPageUrl: `https://www.tiktok.com/@${handle}/video/${i}`,
        firstSeenDate: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
        lastSeenDate: new Date(),
        estimatedImpressions: Math.floor(Math.random() * 200000) + 20000,
      });
    }

    return mockAds;
  }

  private async saveDiscoveredAds(
    competitorId: string,
    ads: any[],
  ): Promise<CompetitorAd[]> {
    const savedAds: CompetitorAd[] = [];

    for (const adData of ads) {
      // Calculate ad hash for deduplication
      const adHash = this.calculateAdHash(adData);

      // Check if ad already exists
      const existing = await this.competitorAdRepository.findOne({
        where: { adHash },
      });

      if (existing) {
        // Update last seen date
        existing.lastSeenDate = adData.lastSeenDate || new Date();
        existing.status = 'ACTIVE';
        existing.runningDays = this.calculateRunningDays(
          existing.firstSeenDate,
          existing.lastSeenDate,
        );
        existing.isLongRunning = existing.runningDays >= 60;
        await this.competitorAdRepository.save(existing);
        savedAds.push(existing);
      } else {
        // Create new ad
        const runningDays = this.calculateRunningDays(
          adData.firstSeenDate,
          adData.lastSeenDate,
        );

        const newAd = this.competitorAdRepository.create({
          competitorId,
          ...adData,
          adHash,
          runningDays,
          isLongRunning: runningDays >= 60,
          status: 'ACTIVE',
        });

        const saved = await this.competitorAdRepository.save(newAd);
        savedAds.push(saved);
      }
    }

    return savedAds;
  }

  private calculateAdHash(adData: any): string {
    const hashString = `${adData.platform}_${adData.externalAdId}_${adData.headline}_${adData.adCopy}`;
    return crypto.createHash('sha256').update(hashString).digest('hex');
  }

  private calculateRunningDays(firstSeen: Date, lastSeen: Date): number {
    const diff = new Date(lastSeen).getTime() - new Date(firstSeen).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private async queueAdDiscovery(competitorId: string): Promise<void> {
    // In production, this would queue a background job
    this.logger.log(`Queuing ad discovery for competitor ${competitorId}`);
    // For now, trigger discovery immediately
    setTimeout(() => {
      this.discoverAdsForCompetitor(competitorId);
    }, 1000);
  }

  // Ad Browsing & Filtering
  async listCompetitorAds(
    competitorId: string,
    filters?: {
      platform?: string;
      format?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      limit?: number;
      offset?: number;
    },
  ): Promise<{ ads: CompetitorAd[]; total: number }> {
    const query = this.competitorAdRepository.createQueryBuilder('ad').where('ad.competitorId = :competitorId', { competitorId });

    if (filters?.platform) {
      query.andWhere('ad.platform = :platform', { platform: filters.platform });
    }

    if (filters?.format) {
      query.andWhere('ad.format = :format', { format: filters.format });
    }

    if (filters?.status) {
      query.andWhere('ad.status = :status', { status: filters.status });
    }

    const sortBy = filters?.sortBy || 'lastSeenDate';
    const sortOrder = filters?.sortOrder || 'DESC';
    query.orderBy(`ad.${sortBy}`, sortOrder);

    const total = await query.getCount();

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    if (filters?.offset) {
      query.offset(filters.offset);
    }

    const ads = await query.getMany();

    return { ads, total };
  }

  async getCompetitorAd(id: string): Promise<CompetitorAd> {
    const ad = await this.competitorAdRepository.findOne({
      where: { id },
      relations: ['competitor'],
    });

    if (!ad) {
      throw new Error(`Competitor ad ${id} not found`);
    }

    return ad;
  }

  // Spend Estimation
  async calculateSpendEstimates(competitorId: string, month: Date): Promise<void> {
    this.logger.log(`Calculating spend estimates for competitor ${competitorId}, month ${month}`);

    const competitor = await this.getCompetitor(competitorId);
    const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
    const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    // Get all ads active during this month
    const ads = await this.competitorAdRepository.find({
      where: {
        competitorId,
        firstSeenDate: LessThan(monthEnd),
        lastSeenDate: MoreThan(monthStart),
      },
    });

    // Calculate estimates by platform
    const platformEstimates = this.calculatePlatformSpends(ads);

    for (const [platform, estimate] of Object.entries(platformEstimates)) {
      await this.spendEstimateRepository.save({
        competitorId,
        platform,
        month: monthStart,
        estimatedSpendMin: estimate.min,
        estimatedSpendMax: estimate.max,
        estimatedSpendMid: (estimate.min + estimate.max) / 2,
        dataSource: estimate.source,
        adsCount: estimate.count,
      });
    }

    // Calculate total
    const totalMin = Object.values(platformEstimates).reduce(
      (sum: number, e: any) => sum + e.min,
      0,
    );
    const totalMax = Object.values(platformEstimates).reduce(
      (sum: number, e: any) => sum + e.max,
      0,
    );

    await this.spendEstimateRepository.save({
      competitorId,
      platform: 'TOTAL',
      month: monthStart,
      estimatedSpendMin: totalMin,
      estimatedSpendMax: totalMax,
      estimatedSpendMid: (totalMin + totalMax) / 2,
      dataSource: 'CALCULATED',
      adsCount: ads.length,
    });
  }

  private calculatePlatformSpends(ads: CompetitorAd[]): Record<string, any> {
    const platformGroups = ads.reduce((acc, ad) => {
      if (!acc[ad.platform]) {
        acc[ad.platform] = [];
      }
      acc[ad.platform].push(ad);
      return acc;
    }, {} as Record<string, CompetitorAd[]>);

    const estimates: Record<string, any> = {};

    for (const [platform, platformAds] of Object.entries(platformGroups)) {
      // Simplified spend estimation based on impressions
      // In production, use actual Meta Ad Library spend ranges where available
      const totalImpressions = platformAds.reduce(
        (sum, ad) => sum + (ad.estimatedImpressions || 0),
        0,
      );

      // Assume CPM range of $5-$15
      const estimatedSpendMin = (totalImpressions / 1000) * 5;
      const estimatedSpendMax = (totalImpressions / 1000) * 15;

      estimates[platform] = {
        min: estimatedSpendMin,
        max: estimatedSpendMax,
        count: platformAds.length,
        source: platform === 'META' ? 'META_AD_LIBRARY' : 'EXTRAPOLATED',
      };
    }

    return estimates;
  }

  async getSpendEstimates(
    competitorId: string,
    startMonth: Date,
    endMonth: Date,
  ): Promise<CompetitorSpendEstimate[]> {
    return await this.spendEstimateRepository.find({
      where: {
        competitorId,
        month: Between(startMonth, endMonth),
      },
      order: { month: 'ASC', platform: 'ASC' },
    });
  }

  // Alerts
  async createAlert(dto: CreateCompetitorAlertDto): Promise<CompetitorAlert> {
    const alert = this.competitorAlertRepository.create(dto);
    return await this.competitorAlertRepository.save(alert);
  }

  async listAlerts(workspaceId: string, competitorId?: string): Promise<CompetitorAlert[]> {
    const where: any = { workspaceId };
    if (competitorId) {
      where.competitorId = competitorId;
    }

    return await this.competitorAlertRepository.find({
      where,
      relations: ['competitor'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateAlert(
    id: string,
    updates: Partial<CreateCompetitorAlertDto>,
  ): Promise<CompetitorAlert> {
    await this.competitorAlertRepository.update(id, updates);
    const alert = await this.competitorAlertRepository.findOne({ where: { id } });
    if (!alert) {
      throw new Error(`Alert ${id} not found`);
    }
    return alert;
  }

  async deleteAlert(id: string): Promise<void> {
    await this.competitorAlertRepository.delete(id);
  }

  private async checkAndTriggerAlerts(competitorId: string): Promise<void> {
    const alerts = await this.competitorAlertRepository.find({
      where: { competitorId, enabled: true },
    });

    for (const alert of alerts) {
      const shouldTrigger = await this.evaluateAlert(alert);
      if (shouldTrigger) {
        await this.triggerAlert(alert);
      }
    }
  }

  private async evaluateAlert(alert: CompetitorAlert): Promise<boolean> {
    switch (alert.alertType) {
      case 'NEW_ADS_LAUNCHED':
        return await this.evaluateNewAdsAlert(alert);
      case 'SPEND_INCREASE':
      case 'SPEND_DECREASE':
        return await this.evaluateSpendChangeAlert(alert);
      case 'LONG_RUNNING_AD':
        return await this.evaluateLongRunningAlert(alert);
      default:
        return false;
    }
  }

  private async evaluateNewAdsAlert(alert: CompetitorAlert): Promise<boolean> {
    const timeWindow = alert.threshold.timeWindow || '1_DAY';
    const daysBack = timeWindow === '1_DAY' ? 1 : timeWindow === '7_DAYS' ? 7 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const newAdsCount = await this.competitorAdRepository.count({
      where: {
        competitorId: alert.competitorId,
        firstSeenDate: MoreThan(cutoffDate),
      },
    });

    return newAdsCount >= alert.threshold.value;
  }

  private async evaluateSpendChangeAlert(alert: CompetitorAlert): Promise<boolean> {
    // Get last two months of spend data
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [thisMonthSpend, lastMonthSpend] = await Promise.all([
      this.spendEstimateRepository.findOne({
        where: { competitorId: alert.competitorId, month: thisMonth, platform: 'TOTAL' },
      }),
      this.spendEstimateRepository.findOne({
        where: { competitorId: alert.competitorId, month: lastMonth, platform: 'TOTAL' },
      }),
    ]);

    if (!thisMonthSpend || !lastMonthSpend) {
      return false;
    }

    const changePercent =
      ((Number(thisMonthSpend.estimatedSpendMid) -
        Number(lastMonthSpend.estimatedSpendMid)) /
        Number(lastMonthSpend.estimatedSpendMid)) *
      100;

    if (alert.alertType === 'SPEND_INCREASE') {
      return changePercent >= alert.threshold.value;
    } else {
      return changePercent <= -alert.threshold.value;
    }
  }

  private async evaluateLongRunningAlert(alert: CompetitorAlert): Promise<boolean> {
    const longRunningCount = await this.competitorAdRepository.count({
      where: {
        competitorId: alert.competitorId,
        isLongRunning: true,
        status: 'ACTIVE',
      },
    });

    return longRunningCount >= alert.threshold.value;
  }

  private async triggerAlert(alert: CompetitorAlert): Promise<void> {
    this.logger.log(`Triggering alert ${alert.id} for competitor ${alert.competitorId}`);

    // Update alert metadata
    await this.competitorAlertRepository.update(alert.id, {
      lastTriggeredAt: new Date(),
      triggeredCount: alert.triggeredCount + 1,
    });

    // In production, send actual notifications via email, WhatsApp, etc.
    // For now, just log
    this.logger.log(`Alert notification would be sent to: ${alert.recipients?.join(', ')}`);
  }
}
