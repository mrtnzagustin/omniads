import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CreativeAsset } from './creative-asset.entity';

@Entity('creative_metric_snapshots')
@Index(['creativeId', 'periodStart', 'periodEnd'])
export class CreativeMetricSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  creativeId: string;

  @ManyToOne(() => CreativeAsset)
  @JoinColumn({ name: 'creativeId' })
  creative: CreativeAsset;

  @Column({ type: 'timestamp' })
  periodStart: Date;

  @Column({ type: 'timestamp' })
  periodEnd: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  spend: number;

  @Column('int', { default: 0 })
  impressions: number;

  @Column('int', { default: 0 })
  clicks: number;

  @Column('int', { default: 0 })
  conversions: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  revenue: number;

  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  roas: number;

  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  ctr: number; // Click-through rate

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cpa: number; // Cost per acquisition

  @Column('decimal', { precision: 10, scale: 4, default: 0 })
  engagementRate: number;

  @Column('jsonb', { nullable: true })
  additionalMetrics: any; // Platform-specific metrics

  @CreateDateColumn()
  createdAt: Date;
}
