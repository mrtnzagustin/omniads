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

export enum ActionTokenType {
  APPROVE_BUDGET = 'APPROVE_BUDGET',
  ACKNOWLEDGE_ALERT = 'ACKNOWLEDGE_ALERT',
  ASSIGN_RECOMMENDATION = 'ASSIGN_RECOMMENDATION',
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
}

@Entity('whatsapp_action_tokens')
@Index(['token'], { unique: true })
export class WhatsAppActionToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string; // Short-lived token

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ActionTokenType,
  })
  actionType: ActionTokenType;

  @Column()
  entityType: string; // e.g., 'BudgetAdjustment', 'AnomalyAlert', 'Recommendation'

  @Column('uuid')
  entityId: string;

  @Column('jsonb', { nullable: true })
  permissions: any; // What actions are allowed with this token

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
