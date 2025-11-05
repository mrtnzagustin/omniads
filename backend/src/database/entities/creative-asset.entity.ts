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

export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CAROUSEL = 'CAROUSEL',
  STORY = 'STORY',
  TEXT = 'TEXT',
}

export enum FunnelStage {
  AWARENESS = 'AWARENESS',
  CONSIDERATION = 'CONSIDERATION',
  CONVERSION = 'CONVERSION',
  RETENTION = 'RETENTION',
}

@Entity('creative_assets')
@Index(['platform', 'campaignId'])
export class CreativeAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platformId: string; // ID from the ad platform

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform: Platform;

  @Column('uuid')
  campaignId: string;

  @ManyToOne(() => Campaign)
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  assetType: AssetType;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  assetUrl: string;

  @Column('text', { nullable: true })
  headline: string;

  @Column('text', { nullable: true })
  primaryText: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  copyVariants: any; // Different copy versions tested

  @Column({
    type: 'enum',
    enum: FunnelStage,
    nullable: true,
  })
  funnelStage: FunnelStage;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  fatigueScore: number; // 0-100, higher = more fatigued

  @Column('jsonb', { nullable: true })
  metricsSnapshot: any; // Latest performance metrics

  @Column('jsonb', { nullable: true })
  targeting: any; // Audience targeting data

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
