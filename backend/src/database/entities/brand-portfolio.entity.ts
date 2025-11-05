import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('brand_portfolios')
export class BrandPortfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  portfolioName: string;

  @Column('simple-array')
  brandIds: string[];

  @Column('simple-json')
  brandConfigs: {
    brandId: string;
    brandName: string;
    budgetShare: number;
    campaignIds: string[];
    targetRoas: number;
    priority: number;
  }[];

  @Column('simple-json')
  crossBrandAllocation: {
    totalBudget: number;
    allocationType: 'equal' | 'weighted' | 'performance' | 'ai_optimized';
    rebalanceFrequency: 'daily' | 'weekly' | 'monthly';
    minBudgetPerBrand: number;
    maxBudgetPerBrand: number;
  };

  @Column('simple-json', { nullable: true })
  performanceMetrics: {
    totalSpend: number;
    totalRevenue: number;
    portfolioRoas: number;
    bestPerformingBrand: string;
    worstPerformingBrand: string;
    brandPerformances: {
      brandId: string;
      spend: number;
      revenue: number;
      roas: number;
      conversions: number;
    }[];
  };

  @Column('simple-json', { nullable: true })
  unifiedReporting: {
    reportType: 'overview' | 'comparative' | 'detailed';
    metrics: string[];
    customDashboard: boolean;
    scheduledReports: {
      frequency: string;
      recipients: string[];
      format: 'pdf' | 'excel' | 'csv';
    }[];
  };

  @Column({
    type: 'enum',
    enum: ['active', 'paused', 'archived'],
    default: 'active'
  })
  status: 'active' | 'paused' | 'archived';

  @Column('simple-json', { nullable: true })
  aiOptimization: {
    enabled: boolean;
    lastOptimization: Date;
    optimizationScore: number;
    recommendations: {
      brandId: string;
      action: string;
      expectedImpact: number;
      reason: string;
    }[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
