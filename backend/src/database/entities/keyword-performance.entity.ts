import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('keyword_performance')
@Index(['workspaceId', 'keyword', 'date'])
@Index(['campaignId', 'date'])
export class KeywordPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  keyword: string;

  @Column({ nullable: true })
  campaignId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'integer', default: 0 })
  impressions: number;

  @Column({ type: 'integer', default: 0 })
  clicks: number;

  @Column({ type: 'integer', default: 0 })
  conversions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  cost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  ctr: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageCpc: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  roas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  conversionRate: number;

  @CreateDateColumn()
  createdAt: Date;
}
