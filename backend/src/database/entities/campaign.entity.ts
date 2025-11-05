import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platform: string; // "meta", "google", "tiktok"

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  externalId: string; // The ID from the ad platform

  @Column('timestamp')
  date: Date;

  @Column('float')
  investment: number;

  @Column('float')
  revenue: number;

  @Column('float')
  roas: number;

  @Column('int')
  impressions: number;

  @Column('int')
  clicks: number;

  @Column({ type: 'int', default: 0 })
  conversions: number;

  @Column({ type: 'float', default: 0 })
  spent: number; // Alias for investment for compatibility

  @Column({ type: 'varchar', nullable: true })
  status: string; // 'active', 'paused', 'deleted'

  @Column({ type: 'varchar', nullable: true })
  objective: string; // 'conversions', 'sales', 'traffic', 'reach', etc.

  @Column({ type: 'float', nullable: true })
  budget: number; // Daily budget

  @Column({ type: 'jsonb', nullable: true })
  targetAudience: string[]; // Target audience segments

  @Column({ type: 'jsonb', nullable: true })
  geoTargeting: string[]; // Geographic targeting

  @Column({ type: 'boolean', default: false })
  conversionTracking: boolean; // Whether conversion tracking is enabled

  @Column({ type: 'jsonb', nullable: true })
  adSets: any[]; // Ad sets/creatives
}
