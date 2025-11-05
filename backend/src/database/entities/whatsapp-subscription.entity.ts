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
import { User } from './user.entity';

@Entity('whatsapp_subscriptions')
@Index(['userId'], { unique: true })
export class WhatsAppSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  phoneNumber: string;

  @Column({ default: true })
  optedIn: boolean;

  @Column({ default: 'en' })
  preferredLanguage: string;

  @Column('jsonb', { nullable: true })
  notificationWindows: any; // e.g., { start: '08:00', end: '20:00', timezone: 'America/New_York' }

  @Column({ type: 'timestamp', nullable: true })
  lastDigestSentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastInteractionAt: Date;

  @Column('jsonb', { nullable: true })
  preferences: any; // User preferences for digest content

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
