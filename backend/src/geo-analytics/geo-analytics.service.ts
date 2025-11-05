import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoPerformance } from '../database/entities/geo-performance.entity';

@Injectable()
export class GeoAnalyticsService {
  constructor(
    @InjectRepository(GeoPerformance)
    private geoPerformanceRepository: Repository<GeoPerformance>,
  ) {}

  async getGeoPerformance(workspaceId: string, level: string, startDate: Date, endDate: Date): Promise<any[]> {
    const data = await this.geoPerformanceRepository
      .createQueryBuilder('geo')
      .select('geo.region', 'region')
      .addSelect('SUM(geo.impressions)', 'impressions')
      .addSelect('SUM(geo.clicks)', 'clicks')
      .addSelect('SUM(geo.conversions)', 'conversions')
      .addSelect('SUM(geo.revenue)', 'revenue')
      .addSelect('SUM(geo.spend)', 'spend')
      .addSelect('SUM(geo.revenue) / NULLIF(SUM(geo.spend), 0)', 'roas')
      .where('geo.workspaceId = :workspaceId', { workspaceId })
      .andWhere('geo.level = :level', { level })
      .andWhere('geo.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('geo.region')
      .orderBy('roas', 'DESC')
      .getRawMany();

    return data;
  }

  async getGeoRecommendations(workspaceId: string): Promise<any[]> {
    const geoData = await this.getGeoPerformance(workspaceId, 'STATE', new Date('2024-01-01'), new Date());

    const recommendations = geoData
      .map(geo => {
        const roas = parseFloat(geo.roas || '0');
        if (roas > 3.5 && parseFloat(geo.spend) > 1000) {
          return {
            region: geo.region,
            type: 'INCREASE_BUDGET',
            rationale: `High ROAS (${roas.toFixed(2)}x) in ${geo.region}. Increase budget by 30% to scale.`,
            impact: { revenue: parseFloat(geo.revenue) * 1.3 },
          };
        } else if (roas < 1.5 && parseFloat(geo.spend) > 1000) {
          return {
            region: geo.region,
            type: 'DECREASE_BUDGET',
            rationale: `Low ROAS (${roas.toFixed(2)}x) in ${geo.region}. Reduce budget by 20% to improve efficiency.`,
            impact: { spend: parseFloat(geo.spend) * 0.8 },
          };
        }
        return null;
      })
      .filter(Boolean);

    return recommendations;
  }
}
