import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('forecasts')
@Index(['workspaceId', 'targetDate', 'metricType'])
@Index(['workspaceId', 'forecastDate'])
export class Forecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column({ type: 'timestamp' })
  forecastDate: Date; // When this forecast was generated

  @Column({ type: 'timestamp' })
  targetDate: Date; // The date being forecasted

  @Column({
    type: 'enum',
    enum: ['ROAS', 'REVENUE', 'SPEND', 'CONVERSIONS', 'CPA'],
  })
  metricType: 'ROAS' | 'REVENUE' | 'SPEND' | 'CONVERSIONS' | 'CPA';

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  predictedValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  confidenceInterval80Lower: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  confidenceInterval80Upper: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  confidenceInterval95Lower: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  confidenceInterval95Upper: number;

  @Column({ nullable: true })
  modelVersion: string;

  @Column({ type: 'jsonb', nullable: true })
  modelMetadata: Record<string, any>; // Store model parameters, features used, etc.

  @Column({ nullable: true })
  campaignId: string; // If forecast is campaign-specific

  @Column({ nullable: true })
  channel: string; // If forecast is channel-specific (Google, Meta, TikTok)

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'COMPLETED' | 'FAILED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
