import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('forecast_scenarios')
@Index(['workspaceId', 'createdAt'])
export class ForecastScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  adjustments: Array<{
    type: 'BUDGET_INCREASE' | 'BUDGET_DECREASE' | 'CHANNEL_SHIFT' | 'CAMPAIGN_PAUSE' | 'CAMPAIGN_LAUNCH';
    targetId?: string; // campaignId or channel name
    targetType: 'CAMPAIGN' | 'CHANNEL' | 'WORKSPACE';
    value: number; // e.g., budget amount or percentage
    unit: 'ABSOLUTE' | 'PERCENTAGE';
    startDate: string;
    endDate?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  predictedOutcomes: Array<{
    metricType: string;
    baselineValue: number;
    predictedValue: number;
    change: number;
    changePercentage: number;
    confidenceInterval80Lower: number;
    confidenceInterval80Upper: number;
    confidenceInterval95Lower: number;
    confidenceInterval95Upper: number;
  }>;

  @Column({ type: 'timestamp', nullable: true })
  calculatedAt: Date;

  @Column({ default: 'DRAFT' })
  status: 'DRAFT' | 'CALCULATED' | 'ARCHIVED';

  @Column({ nullable: true })
  createdBy: string; // userId

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
