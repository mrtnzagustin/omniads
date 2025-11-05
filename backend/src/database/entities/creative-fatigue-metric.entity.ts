import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('creative_fatigue_metrics')
@Index(['creativeId', 'date'])
@Index(['workspaceId', 'date'])
export class CreativeFatigueMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  @Index()
  creativeId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  ctr: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  conversionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cpa: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  frequencyScore: number; // Average times shown to same user

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  fatigueScore: number; // 0-100, higher = more fatigued

  @Column({ default: false })
  isFatigued: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
