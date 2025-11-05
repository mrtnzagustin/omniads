import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisplayAd } from '../database/entities/display-ad.entity';

@Injectable()
export class DisplayAdTrackerService {
  private readonly logger = new Logger(DisplayAdTrackerService.name);

  constructor(
    @InjectRepository(DisplayAd)
    private displayAdRepository: Repository<DisplayAd>,
  ) {}

  async discoverDisplayAds(competitorId: string): Promise<DisplayAd[]> {
    this.logger.log(`Discovering display ads for competitor ${competitorId}`);

    // Simulated discovery - in production, integrate with ad networks
    const mockAds = [];
    const networks = ['GDN', 'TABOOLA', 'OUTBRAIN'];

    for (const network of networks) {
      for (let i = 0; i < 5; i++) {
        mockAds.push(this.displayAdRepository.create({
          competitorId,
          adNetwork: network,
          externalAdId: `${network}_${competitorId}_${Date.now()}_${i}`,
          adCopy: `Sample display ad copy from ${network}`,
          publishers: ['CNN.com', 'Forbes.com', 'TechCrunch.com'],
          firstSeen: new Date(),
          lastSeen: new Date(),
          estimatedImpressions: Math.floor(Math.random() * 100000),
          format: ['BANNER', 'NATIVE_ARTICLE', 'VIDEO'][Math.floor(Math.random() * 3)],
          status: 'ACTIVE',
        }));
      }
    }

    return this.displayAdRepository.save(mockAds);
  }

  async listDisplayAds(competitorId: string, filters?: any): Promise<DisplayAd[]> {
    const query = this.displayAdRepository.createQueryBuilder('ad')
      .where('ad.competitorId = :competitorId', { competitorId });

    if (filters?.adNetwork) {
      query.andWhere('ad.adNetwork = :adNetwork', { adNetwork: filters.adNetwork });
    }

    return query.orderBy('ad.lastSeen', 'DESC').limit(100).getMany();
  }

  async getTopPublishers(competitorId: string): Promise<any[]> {
    const ads = await this.displayAdRepository.find({ where: { competitorId } });

    const publisherStats: Record<string, number> = {};
    ads.forEach(ad => {
      ad.publishers?.forEach(pub => {
        publisherStats[pub] = (publisherStats[pub] || 0) + (ad.estimatedImpressions || 0);
      });
    });

    return Object.entries(publisherStats)
      .map(([publisher, impressions]) => ({ publisher, estimatedImpressions: impressions }))
      .sort((a, b) => b.estimatedImpressions - a.estimatedImpressions)
      .slice(0, 20);
  }
}
