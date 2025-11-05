import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Competitor } from './competitor.entity';

@Entity('competitor_alerts')
@Index(['competitorId', 'enabled'])
@Index(['workspaceId', 'enabled'])
export class CompetitorAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  @Index()
  competitorId: string;

  @ManyToOne(() => Competitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'competitorId' })
  competitor: Competitor;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['NEW_ADS_LAUNCHED', 'SPEND_INCREASE', 'SPEND_DECREASE', 'LONG_RUNNING_AD', 'AD_REMOVED'],
  })
  alertType: 'NEW_ADS_LAUNCHED' | 'SPEND_INCREASE' | 'SPEND_DECREASE' | 'LONG_RUNNING_AD' | 'AD_REMOVED';

  @Column({ type: 'jsonb' })
  threshold: {
    value: number;
    unit: string; // 'ADS_COUNT', 'PERCENTAGE', 'DAYS'
    timeWindow?: string; // '1_DAY', '7_DAYS', '30_DAYS'
  };

  @Column({ type: 'jsonb' })
  notificationChannels: {
    email?: boolean;
    whatsapp?: boolean;
    slack?: boolean;
    inApp?: boolean;
  };

  @Column({ type: 'simple-array', nullable: true })
  recipients: string[]; // Email addresses or user IDs

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastTriggeredAt: Date;

  @Column({ type: 'integer', default: 0 })
  triggeredCount: number;

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
