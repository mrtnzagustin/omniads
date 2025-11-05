import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecommendationType } from './recommendation.entity';

export enum PlaybookTrigger {
  STATUS_CHANGE = 'STATUS_CHANGE',
  PRIORITY_CHANGE = 'PRIORITY_CHANGE',
  DUE_DATE_APPROACHING = 'DUE_DATE_APPROACHING',
  OVERDUE = 'OVERDUE',
}

export enum PlaybookAction {
  CREATE_TASK = 'CREATE_TASK',
  SEND_NOTIFICATION = 'SEND_NOTIFICATION',
  REOPEN_ITEM = 'REOPEN_ITEM',
  ASSIGN_OWNER = 'ASSIGN_OWNER',
}

@Entity('automation_playbooks')
export class AutomationPlaybook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({
    type: 'enum',
    enum: PlaybookTrigger,
  })
  trigger: PlaybookTrigger;

  @Column('jsonb')
  conditions: any; // e.g., { recommendationType: 'BUDGET_SHIFT', toStatus: 'DONE' }

  @Column({
    type: 'enum',
    enum: PlaybookAction,
    array: true,
  })
  actions: PlaybookAction[];

  @Column('jsonb')
  actionConfig: any; // Configuration for each action

  @Column({ default: 0 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
