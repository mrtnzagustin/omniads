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

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

@Entity('whatsapp_conversation_logs')
@Index(['userId', 'createdAt'])
export class WhatsAppConversationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: MessageDirection,
  })
  direction: MessageDirection;

  @Column('text')
  messageText: string;

  @Column({ nullable: true })
  detectedIntent: string; // AI-detected intent for inbound messages

  @Column('text', { nullable: true })
  aiResponse: string; // AI-generated response for queries

  @Column('jsonb', { nullable: true })
  metadata: any; // Additional context (buttons, media, etc.)

  @Column({ nullable: true })
  twilioMessageSid: string;

  @CreateDateColumn()
  createdAt: Date;
}
