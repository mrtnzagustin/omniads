import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AnomalyAlert } from './anomaly-alert.entity';
import { NotificationChannel } from './alert-routing-rule.entity';

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
}

@Entity('alert_notification_logs')
@Index(['alertId', 'channel'])
export class AlertNotificationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  alertId: string;

  @ManyToOne(() => AnomalyAlert)
  @JoinColumn({ name: 'alertId' })
  alert: AnomalyAlert;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
  })
  channel: NotificationChannel;

  @Column()
  recipient: string; // User ID, email, or phone number

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column('text', { nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  acknowledgementToken: string;

  @Column('jsonb', { nullable: true })
  metadata: any; // Channel-specific delivery data

  @CreateDateColumn()
  createdAt: Date;
}
