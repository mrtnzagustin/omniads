import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('competitors')
@Index(['workspaceId', 'status'])
export class Competitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  domain: string;

  @Column({ nullable: true })
  facebookPageId: string;

  @Column({ nullable: true })
  instagramHandle: string;

  @Column({ nullable: true })
  tiktokHandle: string;

  @Column({ nullable: true })
  youtubeChannelId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'PAUSED', 'ARCHIVED'],
    default: 'ACTIVE',
  })
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

  @Column({ type: 'timestamp', nullable: true })
  lastScannedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  addedBy: string; // userId

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
