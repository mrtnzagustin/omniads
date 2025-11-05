import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandPortfolio } from '../database/entities/brand-portfolio.entity';

export interface CreateBrandPortfolioDto {
  userId: string;
  portfolioName: string;
  brandConfigs: {
    brandId: string;
    brandName: string;
    budgetShare: number;
    campaignIds: string[];
    targetRoas: number;
    priority: number;
  }[];
  crossBrandAllocation: {
    totalBudget: number;
    allocationType: 'equal' | 'weighted' | 'performance' | 'ai_optimized';
    rebalanceFrequency: 'daily' | 'weekly' | 'monthly';
    minBudgetPerBrand: number;
    maxBudgetPerBrand: number;
  };
}

export interface OptimizeBrandAllocationDto {
  portfolioId: string;
  performanceData: {
    brandId: string;
    currentSpend: number;
    revenue: number;
    conversions: number;
  }[];
}

@Injectable()
export class MultiBrandOrchestratorService {
  constructor(
    @InjectRepository(BrandPortfolio)
    private brandPortfolioRepository: Repository<BrandPortfolio>,
  ) {}

  async createPortfolio(dto: CreateBrandPortfolioDto): Promise<BrandPortfolio> {
    const brandIds = dto.brandConfigs.map(config => config.brandId);

    const portfolio = this.brandPortfolioRepository.create({
      userId: dto.userId,
      portfolioName: dto.portfolioName,
      brandIds,
      brandConfigs: dto.brandConfigs,
      crossBrandAllocation: dto.crossBrandAllocation,
      status: 'active',
      aiOptimization: {
        enabled: dto.crossBrandAllocation.allocationType === 'ai_optimized',
        lastOptimization: new Date(),
        optimizationScore: 0,
        recommendations: []
      }
    });

    return await this.brandPortfolioRepository.save(portfolio);
  }

  async findAllByUser(userId: string): Promise<BrandPortfolio[]> {
    return await this.brandPortfolioRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<BrandPortfolio | null> {
    return await this.brandPortfolioRepository.findOne({ where: { id } });
  }

  async optimizeBrandAllocation(dto: OptimizeBrandAllocationDto): Promise<BrandPortfolio> {
    const portfolio = await this.findOne(dto.portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    // Calculate ROAS for each brand
    const brandPerformances = dto.performanceData.map(data => ({
      brandId: data.brandId,
      spend: data.currentSpend,
      revenue: data.revenue,
      roas: data.currentSpend > 0 ? data.revenue / data.currentSpend : 0,
      conversions: data.conversions
    }));

    const totalSpend = brandPerformances.reduce((sum, b) => sum + b.spend, 0);
    const totalRevenue = brandPerformances.reduce((sum, b) => sum + b.revenue, 0);
    const portfolioRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    // Find best and worst performing brands
    const sortedByRoas = [...brandPerformances].sort((a, b) => b.roas - a.roas);
    const bestPerformingBrand = sortedByRoas[0]?.brandId || '';
    const worstPerformingBrand = sortedByRoas[sortedByRoas.length - 1]?.brandId || '';

    // Generate AI recommendations
    const recommendations = this.generateRecommendations(portfolio, brandPerformances);

    // Update portfolio with performance metrics and recommendations
    portfolio.performanceMetrics = {
      totalSpend,
      totalRevenue,
      portfolioRoas,
      bestPerformingBrand,
      worstPerformingBrand,
      brandPerformances
    };

    portfolio.aiOptimization = {
      enabled: true,
      lastOptimization: new Date(),
      optimizationScore: Math.min(100, portfolioRoas * 20), // Simple scoring
      recommendations
    };

    return await this.brandPortfolioRepository.save(portfolio);
  }

  private generateRecommendations(
    portfolio: BrandPortfolio,
    brandPerformances: any[]
  ): any[] {
    const recommendations = [];
    const avgRoas = brandPerformances.reduce((sum, b) => sum + b.roas, 0) / brandPerformances.length;

    for (const brand of brandPerformances) {
      if (brand.roas > avgRoas * 1.5) {
        recommendations.push({
          brandId: brand.brandId,
          action: 'increase_budget',
          expectedImpact: 0.25,
          reason: `Brand is outperforming portfolio average ROAS (${brand.roas.toFixed(2)} vs ${avgRoas.toFixed(2)})`
        });
      } else if (brand.roas < avgRoas * 0.5) {
        recommendations.push({
          brandId: brand.brandId,
          action: 'decrease_budget',
          expectedImpact: 0.15,
          reason: `Brand is underperforming portfolio average ROAS (${brand.roas.toFixed(2)} vs ${avgRoas.toFixed(2)})`
        });
      }
    }

    return recommendations;
  }

  async getUnifiedReport(portfolioId: string): Promise<any> {
    const portfolio = await this.findOne(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    return {
      portfolioName: portfolio.portfolioName,
      totalBrands: portfolio.brandIds.length,
      performanceMetrics: portfolio.performanceMetrics,
      crossBrandAllocation: portfolio.crossBrandAllocation,
      aiOptimization: portfolio.aiOptimization,
      brandComparison: portfolio.performanceMetrics?.brandPerformances.map(brand => {
        const config = portfolio.brandConfigs.find(c => c.brandId === brand.brandId);
        return {
          ...brand,
          brandName: config?.brandName,
          budgetShare: config?.budgetShare,
          targetRoas: config?.targetRoas,
          vsTarget: brand.roas - (config?.targetRoas || 0)
        };
      })
    };
  }

  async updatePortfolio(id: string, updates: Partial<BrandPortfolio>): Promise<BrandPortfolio> {
    await this.brandPortfolioRepository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Portfolio not found after update');
    }
    return updated;
  }

  async deletePortfolio(id: string): Promise<void> {
    await this.brandPortfolioRepository.delete(id);
  }
}
