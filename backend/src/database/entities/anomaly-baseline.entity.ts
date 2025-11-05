import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { Platform } from './budget-recommendation.entity';

export enum MetricType {
  SPEND = 'SPEND',
  ROAS = 'ROAS',
  CONVERSIONS = 'CONVERSIONS',
  CTR = 'CTR',
  CPA = 'CPA',
  IMPRESSIONS = 'IMPRESSIONS',
  CLICKS = 'CLICKS',
}

@Entity('anomaly_baselines')
@Index(['campaignId', 'metric', 'platform'])
export class AnomalyBaseline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  campaignId: string;

  @ManyToOne(() => Campaign, { nullable: true })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform: Platform;

  @Column({
    type: 'enum',
    enum: MetricType,
  })
  metric: MetricType;

  @Column('decimal', { precision: 15, scale: 4 })
  mean: number;

  @Column('decimal', { precision: 15, scale: 4 })
  variance: number;

  @Column('decimal', { precision: 15, scale: 4 })
  upperControlLimit: number;

  @Column('decimal', { precision: 15, scale: 4 })
  lowerControlLimit: number;

  @Column('jsonb', { nullable: true })
  seasonalityVectors: any; // Store seasonality patterns

  @Column('int', { default: 30 })
  rollingWindowDays: number;

  @Column({ type: 'timestamp' })
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
