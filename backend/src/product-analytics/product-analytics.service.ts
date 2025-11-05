import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductPerformance } from '../database/entities/product-performance.entity';

@Injectable()
export class ProductAnalyticsService {
  constructor(
    @InjectRepository(ProductPerformance)
    private productPerformanceRepository: Repository<ProductPerformance>,
  ) {}

  async getProductPerformance(workspaceId: string, startDate: Date, endDate: Date): Promise<any[]> {
    const data = await this.productPerformanceRepository
      .createQueryBuilder('perf')
      .select('perf.productId', 'productId')
      .addSelect('SUM(perf.adRevenue)', 'adRevenue')
      .addSelect('SUM(perf.organicRevenue)', 'organicRevenue')
      .addSelect('SUM(perf.adSpend)', 'adSpend')
      .addSelect('SUM(perf.adRevenue) / NULLIF(SUM(perf.adSpend), 0)', 'roas')
      .addSelect('SUM(perf.conversions)', 'conversions')
      .addSelect('AVG(perf.aov)', 'aov')
      .where('perf.workspaceId = :workspaceId', { workspaceId })
      .andWhere('perf.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('perf.productId')
      .orderBy('adRevenue', 'DESC')
      .getRawMany();

    return data;
  }

  async getProductRecommendations(workspaceId: string): Promise<any[]> {
    const products = await this.getProductPerformance(workspaceId, new Date('2024-01-01'), new Date());

    return products
      .map(product => {
        const organicRevenue = parseFloat(product.organicRevenue || '0');
        const adSpend = parseFloat(product.adSpend || '0');

        if (organicRevenue > 5000 && adSpend < 500) {
          return {
            productId: product.productId,
            type: 'PROMOTE_ORGANIC',
            rationale: `High organic revenue ($${organicRevenue}) but low ad spend ($${adSpend}). Increase advertising to scale.`,
          };
        }
        return null;
      })
      .filter(Boolean);
  }
}
