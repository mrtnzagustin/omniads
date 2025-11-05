import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Competitor } from './competitor.entity';

@Entity('competitor_ads')
@Index(['competitorId', 'status'])
@Index(['competitorId', 'platform'])
@Index(['firstSeenDate'])
@Index(['lastSeenDate'])
export class CompetitorAd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  competitorId: string;

  @ManyToOne(() => Competitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'competitorId' })
  competitor: Competitor;

  @Column()
  platform: string; // 'META', 'GOOGLE', 'TIKTOK', 'YOUTUBE'

  @Column({ unique: true })
  externalAdId: string; // Platform's ad ID

  @Column({ type: 'text', nullable: true })
  creativeUrl: string; // Image or video URL

  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'text', nullable: true })
  adCopy: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  callToAction: string;

  @Column({ type: 'text', nullable: true })
  landingPageUrl: string;

  @Column({
    type: 'enum',
    enum: ['IMAGE', 'VIDEO', 'CAROUSEL', 'COLLECTION', 'TEXT', 'OTHER'],
    nullable: true,
  })
  format: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'COLLECTION' | 'TEXT' | 'OTHER';

  @Column({ type: 'timestamp' })
  firstSeenDate: Date;

  @Column({ type: 'timestamp' })
  lastSeenDate: Date;

  @Column({ type: 'integer', nullable: true })
  estimatedImpressions: number;

  @Column({ type: 'integer', nullable: true })
  runningDays: number; // Calculated: lastSeenDate - firstSeenDate

  @Column({ default: false })
  isLongRunning: boolean; // True if running for 60+ days

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'REMOVED'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'INACTIVE' | 'REMOVED';

  @Column({ type: 'jsonb', nullable: true })
  platformMetadata: Record<string, any>; // Platform-specific data

  @Column({ type: 'text', nullable: true })
  adHash: string; // For deduplication

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
