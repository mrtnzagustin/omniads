import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface PlatformScoreStats {
  averageScore: number;
  campaignCount: number;
  excellentCount: number;
  goodCount: number;
  fairCount: number;
  poorCount: number;
  topIssues: Array<{
    issue: string;
    frequency: number;
  }>;
}

@Entity('platform_opportunity_aggregates')
export class PlatformOpportunityAggregate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platform: string; // 'meta', 'google', 'tiktok', 'all'

  @Column({ type: 'float' })
  overallScore: number; // Weighted average of all campaigns

  @Column({ type: 'jsonb' })
  stats: PlatformScoreStats;

  @Column({ type: 'date' })
  calculatedFor: Date; // Date this was calculated for

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
