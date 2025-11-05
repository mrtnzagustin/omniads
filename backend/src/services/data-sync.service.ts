import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../database/entities/campaign.entity';
import { Product } from '../database/entities/product.entity';
import { Sale } from '../database/entities/sale.entity';
import { Recommendation, RecommendationStatus } from '../database/entities/recommendation.entity';
import { MetaAdsApiMock } from './mocks/metaApi';
import { GoogleAdsApiMock } from './mocks/googleApi';
import { TikTokAdsApiMock } from './mocks/tiktokApi';
import { TiendaNubeApiMock } from './mocks/tiendanubeApi';
import { AICoreClient } from './ai-core.client';

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);

  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Recommendation)
    private recommendationRepository: Repository<Recommendation>,
    private aiCoreClient: AICoreClient,
  ) {}

  /**
   * Syncs all campaign data from ad platforms
   */
  async syncCampaigns(): Promise<void> {
    this.logger.log('Starting campaign data sync...');

    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    const endDate = new Date();

    try {
      // Fetch from all platforms in parallel
      const metaApi = new MetaAdsApiMock();
      const googleApi = new GoogleAdsApiMock();
      const tiktokApi = new TikTokAdsApiMock();

      const [metaCampaigns, googleCampaigns, tiktokCampaigns] = await Promise.all([
        metaApi.getCampaigns(startDate, endDate),
        googleApi.getCampaigns(startDate, endDate),
        tiktokApi.getCampaigns(startDate, endDate),
      ]);

      // Save Meta campaigns
      for (const campaign of metaCampaigns) {
        await this.campaignRepository.upsert(
          {
            externalId: campaign.id,
            platform: 'meta',
            name: campaign.name,
            date: campaign.date,
            investment: campaign.spend,
            revenue: campaign.revenue,
            roas: campaign.revenue / campaign.spend,
            impressions: campaign.impressions,
            clicks: campaign.clicks,
          },
          ['externalId'],
        );
      }

      // Save Google campaigns
      for (const campaign of googleCampaigns) {
        await this.campaignRepository.upsert(
          {
            externalId: campaign.id,
            platform: 'google',
            name: campaign.name,
            date: campaign.date,
            investment: campaign.spend,
            revenue: campaign.revenue,
            roas: campaign.revenue / campaign.spend,
            impressions: campaign.impressions,
            clicks: campaign.clicks,
          },
          ['externalId'],
        );
      }

      // Save TikTok campaigns
      for (const campaign of tiktokCampaigns) {
        await this.campaignRepository.upsert(
          {
            externalId: campaign.id,
            platform: 'tiktok',
            name: campaign.name,
            date: campaign.date,
            investment: campaign.spend,
            revenue: campaign.revenue,
            roas: campaign.revenue / campaign.spend,
            impressions: campaign.impressions,
            clicks: campaign.clicks,
          },
          ['externalId'],
        );
      }

      this.logger.log(
        `Campaign sync complete. Synced ${metaCampaigns.length + googleCampaigns.length + tiktokCampaigns.length} campaigns`,
      );
    } catch (error) {
      this.logger.error('Error syncing campaigns:', error);
      throw error;
    }
  }

  /**
   * Syncs product catalog and sales data from e-commerce platform
   */
  async syncEcommerce(): Promise<void> {
    this.logger.log('Starting e-commerce data sync...');

    const tiendaNubeApi = new TiendaNubeApiMock();

    try {
      // Fetch products
      const products = await tiendaNubeApi.getProducts();

      for (const product of products) {
        const conversionRate = (product.organicSales / product.organicViews) * 100;

        await this.productRepository.upsert(
          {
            externalId: product.id,
            name: product.name,
            price: product.price,
            conversionRate: conversionRate,
          },
          ['externalId'],
        );
      }

      // Fetch sales
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
      const endDate = new Date();
      const sales = await tiendaNubeApi.getSales(startDate, endDate);

      for (const sale of sales) {
        const product = await this.productRepository.findOne({
          where: { externalId: sale.productId },
        });

        if (product) {
          const newSale = this.saleRepository.create({
            productId: product.id,
            soldAt: sale.soldAt,
            quantity: sale.quantity,
            amount: sale.amount,
          });
          await this.saleRepository.save(newSale);
        }
      }

      this.logger.log(`E-commerce sync complete. Synced ${products.length} products and ${sales.length} sales`);
    } catch (error) {
      this.logger.error('Error syncing e-commerce data:', error);
      throw error;
    }
  }

  /**
   * Generates AI recommendations based on synced data
   */
  async generateRecommendations(): Promise<void> {
    this.logger.log('Generating AI recommendations...');

    try {
      // Fetch all data for AI analysis
      const campaigns = await this.campaignRepository.find();
      const products = await this.productRepository.find();
      const sales = await this.saleRepository.find({ relations: ['product'] });

      // Call AI Core to generate recommendations
      const aiRecommendations = await this.aiCoreClient.generateRecommendations({
        campaigns,
        products,
        sales,
      });

      // Save recommendations to database
      for (const rec of aiRecommendations) {
        const recommendation = this.recommendationRepository.create({
          type: rec.type,
          title: rec.title,
          description: rec.description,
          data: rec.data,
          status: RecommendationStatus.NEW,
        });
        await this.recommendationRepository.save(recommendation);
      }

      this.logger.log(`Generated ${aiRecommendations.length} AI recommendations`);
    } catch (error) {
      this.logger.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Full sync: campaigns, e-commerce, and recommendations
   */
  async fullSync(): Promise<void> {
    this.logger.log('Starting full data sync...');

    await this.syncCampaigns();
    await this.syncEcommerce();
    await this.generateRecommendations();

    this.logger.log('Full sync complete');
  }
}
