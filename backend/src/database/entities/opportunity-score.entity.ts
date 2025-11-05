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

export enum ScoreCategory {
  EXCELLENT = 'excellent', // 90-100
  GOOD = 'good', // 70-89
  FAIR = 'fair', // 50-69
  POOR = 'poor', // 0-49
}

export interface ScoreBreakdown {
  targeting: number; // 0-20 points
  budget: number; // 0-20 points
  creative: number; // 0-20 points
  bidding: number; // 0-20 points
  optimization: number; // 0-20 points
}

export interface ScoreRecommendation {
  category: string;
  issue: string;
  recommendation: string;
  potentialImpact: 'high' | 'medium' | 'low';
  estimatedImprovement: number; // points
}

@Entity('opportunity_scores')
export class OpportunityScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Campaign, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ name: 'campaign_id' })
  campaignId: string;

  @Column({ type: 'int' })
  totalScore: number; // 0-100

  @Column({
    type: 'enum',
    enum: ScoreCategory,
  })
  category: ScoreCategory;

  @Column({ type: 'jsonb' })
  breakdown: ScoreBreakdown;

  @Column({ type: 'jsonb' })
  recommendations: ScoreRecommendation[];

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'float', nullable: true })
  industryAverage: number; // For comparison

  @Column({ type: 'float', nullable: true })
  topPerformerScore: number; // Top 10% in industry

  @Column({ type: 'int', default: 0 })
  version: number; // Track score recalculations

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
