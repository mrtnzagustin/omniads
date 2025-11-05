import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum DigestStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

@Entity('whatsapp_digests')
@Index(['userId', 'createdAt'])
export class WhatsAppDigest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('jsonb')
  payload: any; // The complete digest content

  @Column('jsonb')
  metricsIncluded: any; // Summary of metrics included in digest

  @Column({
    type: 'enum',
    enum: DigestStatus,
    default: DigestStatus.PENDING,
  })
  status: DigestStatus;

  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column('text', { nullable: true })
  failureReason: string;

  @Column({ nullable: true })
  twilioMessageSid: string;

  @Column('int', { default: 0 })
  retryCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
