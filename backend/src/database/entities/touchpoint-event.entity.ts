import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('touchpoint_events')
@Index(['userId', 'timestamp'])
@Index(['sessionId'])
export class TouchpointEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  channel: string; // 'meta', 'google', 'tiktok', 'organic', 'email'

  @Column({ name: 'campaign_id', nullable: true })
  campaignId: string;

  @Column({ name: 'ad_id', nullable: true })
  adId: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'event_type' })
  eventType: 'IMPRESSION' | 'CLICK' | 'VIEW';

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
