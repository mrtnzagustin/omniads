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
import { User } from './user.entity';
import { MetricType } from './anomaly-baseline.entity';
import { Platform } from './budget-recommendation.entity';

export enum AlertSeverity {
  P1 = 'P1', // Critical
  P2 = 'P2', // High
  P3 = 'P3', // Medium
  P4 = 'P4', // Low
}

export enum AlertStatus {
  OPEN = 'OPEN',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  NO_ACTION_NEEDED = 'NO_ACTION_NEEDED',
}

@Entity('anomaly_alerts')
@Index(['status', 'severity'])
export class AnomalyAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MetricType,
  })
  metric: MetricType;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
  })
  severity: AlertSeverity;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform: Platform;

  @Column('uuid', { nullable: true })
  campaignId: string;

  @ManyToOne(() => Campaign, { nullable: true })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('jsonb')
  impactedEntities: any; // Array of affected campaigns, products, etc.

  @Column('decimal', { precision: 15, scale: 4 })
  actualValue: number;

  @Column('decimal', { precision: 15, scale: 4 })
  expectedValue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  deviationPercentage: number;

  @Column('text', { nullable: true })
  rootCauseInsights: string; // AI-generated insights

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.OPEN,
  })
  status: AlertStatus;

  @Column({ type: 'timestamp' })
  detectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column('uuid', { nullable: true })
  acknowledgedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'acknowledgedBy' })
  acknowledger: User;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column('uuid', { nullable: true })
  resolvedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolvedBy' })
  resolver: User;

  @Column('text', { nullable: true })
  resolutionSummary: string;

  @Column('int', { default: 1 })
  occurrenceCount: number; // For deduplication

  @Column({ nullable: true })
  fingerprint: string; // For deduplication: hash of metric+campaign+period

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
