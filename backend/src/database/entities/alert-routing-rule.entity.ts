import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AlertSeverity } from './anomaly-alert.entity';

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  IN_APP = 'IN_APP',
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
}

@Entity('alert_routing_rules')
export class AlertRoutingRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
  })
  severity: AlertSeverity;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    array: true,
  })
  channels: NotificationChannel[];

  @Column('simple-array')
  recipients: string[]; // User IDs or email addresses

  @Column('int', { default: 15 })
  escalationSlaMinutes: number;

  @Column('simple-array', { nullable: true })
  escalationRecipients: string[]; // Backup recipients if not acknowledged

  @Column('jsonb', { nullable: true })
  quietHours: any; // e.g., { start: '22:00', end: '08:00', timezone: 'UTC' }

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
