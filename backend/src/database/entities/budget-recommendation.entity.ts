import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';

export enum BudgetRecommendationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum Platform {
  META = 'META',
  GOOGLE = 'GOOGLE',
  TIKTOK = 'TIKTOK',
}

@Entity('budget_recommendations')
export class BudgetRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column('decimal', { precision: 10, scale: 2 })
  suggestedDelta: number;

  @Column('text')
  rationale: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  confidenceScore: number;

  @Column({
    type: 'enum',
    enum: BudgetRecommendationStatus,
    default: BudgetRecommendationStatus.PENDING,
  })
  status: BudgetRecommendationStatus;

  @Column('jsonb', { nullable: true })
  metadata: any; // Additional context like historical ROAS, performance metrics

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
