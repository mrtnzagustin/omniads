import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recommendation, RecommendationStatus, RecommendationType } from '../database/entities/recommendation.entity';
import { Product } from '../database/entities/product.entity';
import { TiendaNubeApiMock } from '../services/mocks/tiendanubeApi';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * Get all NEW action items (recommendations)
   */
  async getActionItems() {
    const recommendations = await this.recommendationRepository.find({
      where: {
        status: RecommendationStatus.NEW,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return recommendations;
  }

  /**
   * Archive a recommendation
   */
  async archiveRecommendation(id: string) {
    const recommendation = await this.recommendationRepository.findOne({
      where: { id },
    });

    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    recommendation.status = RecommendationStatus.ARCHIVED;
    await this.recommendationRepository.save(recommendation);

    return {
      success: true,
      message: 'Recommendation archived',
    };
  }

  /**
   * Get organic product opportunities
   * Products with high organic conversion but low ad spend
   */
  async getOrganicOpportunities() {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.conversionRate > :minRate', { minRate: 5.0 })
      .orderBy('product.conversionRate', 'DESC')
      .limit(10)
      .getMany();

    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      conversionRate: product.conversionRate,
      recommendation: `Product has ${product.conversionRate.toFixed(1)}% organic conversion. Consider creating targeted ad campaign.`,
      estimatedRoas: this.estimateRoas(product.conversionRate),
    }));
  }

  /**
   * Get bundle opportunities
   * Products frequently bought together
   */
  async getBundleOpportunities() {
    const tiendaNubeApi = new TiendaNubeApiMock();
    const bundles = await tiendaNubeApi.getBundleOpportunities();

    const opportunities = await Promise.all(
      bundles.map(async bundle => {
        const product1 = await this.productRepository.findOne({
          where: { name: bundle.product1 },
        });
        const product2 = await this.productRepository.findOne({
          where: { name: bundle.product2 },
        });

        const combinedPrice = (product1?.price || 0) + (product2?.price || 0);
        const suggestedBundlePrice = combinedPrice * 0.9; // 10% discount
        const discount = ((combinedPrice - suggestedBundlePrice) / combinedPrice) * 100;

        return {
          product1: bundle.product1,
          product2: bundle.product2,
          coOccurrenceRate: bundle.frequency,
          product1Price: product1?.price || 0,
          product2Price: product2?.price || 0,
          suggestedBundlePrice: Math.round(suggestedBundlePrice),
          suggestedDiscount: Math.round(discount),
          recommendation: `${bundle.frequency}% of ${bundle.product1} purchases include ${bundle.product2}. Create bundle to increase AOV.`,
        };
      }),
    );

    return opportunities;
  }

  /**
   * Estimate ROAS based on conversion rate
   */
  private estimateRoas(conversionRate: number): number {
    // Simple heuristic: higher conversion = higher ROAS
    if (conversionRate > 8) return 5.0;
    if (conversionRate > 6) return 4.0;
    if (conversionRate > 4) return 3.0;
    return 2.0;
  }
}
