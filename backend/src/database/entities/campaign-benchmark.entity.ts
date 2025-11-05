import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('campaign_benchmarks')
@Index(['industry', 'campaignType'])
@Index(['workspaceId', 'campaignId'])
export class CampaignBenchmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  workspaceId: string;

  @Column({ nullable: true })
  campaignId: string;

  @Column()
  industry: string;

  @Column()
  campaignType: string; // 'SEARCH', 'DISPLAY', 'SOCIAL', 'VIDEO'

  @Column()
  region: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  avgCtr: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  avgCpc: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  avgCpa: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  avgRoas: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  avgConversionRate: number;

  @Column({ type: 'integer' })
  sampleSize: number;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ default: 'PUBLIC' })
  benchmarkType: string; // 'PUBLIC', 'CUSTOM', 'WORKSPACE'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
