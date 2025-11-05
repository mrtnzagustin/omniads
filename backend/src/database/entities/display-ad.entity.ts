import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('display_ads')
@Index(['competitorId', 'adNetwork'])
export class DisplayAd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  competitorId: string;

  @Column()
  adNetwork: string; // 'GDN', 'TABOOLA', 'OUTBRAIN', 'FACEBOOK_AUDIENCE_NETWORK'

  @Column({ unique: true })
  externalAdId: string;

  @Column({ type: 'text', nullable: true })
  creativeUrl: string;

  @Column({ type: 'text', nullable: true })
  adCopy: string;

  @Column({ type: 'text', nullable: true })
  landingPage: string;

  @Column({ type: 'simple-array', nullable: true })
  publishers: string[];

  @Column({ type: 'timestamp' })
  firstSeen: Date;

  @Column({ type: 'timestamp' })
  lastSeen: Date;

  @Column({ type: 'integer', nullable: true })
  estimatedImpressions: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedSpend: number;

  @Column({ nullable: true })
  format: string; // 'BANNER', 'NATIVE_ARTICLE', 'VIDEO'

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
