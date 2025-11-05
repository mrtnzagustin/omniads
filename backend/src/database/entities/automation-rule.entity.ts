import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Platform } from './budget-recommendation.entity';

export enum AutomationRuleType {
  AUTO_APPROVE_BUDGET = 'AUTO_APPROVE_BUDGET',
  AUTO_PAUSE_CAMPAIGN = 'AUTO_PAUSE_CAMPAIGN',
  AUTO_SCALE_CAMPAIGN = 'AUTO_SCALE_CAMPAIGN',
}

@Entity('automation_rules')
export class AutomationRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column({
    type: 'enum',
    enum: AutomationRuleType,
  })
  type: AutomationRuleType;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column({ default: true })
  enabled: boolean;

  @Column('jsonb')
  conditions: any; // e.g., { maxPercentageChange: 10, minRoas: 3.0, platforms: ['META', 'GOOGLE'] }

  @Column('jsonb', { nullable: true })
  actions: any; // Define what happens when conditions are met

  @Column({
    type: 'enum',
    enum: Platform,
    nullable: true,
  })
  platform: Platform; // Optional: apply to specific platform

  @Column({ default: 0 })
  priority: number; // Higher priority rules are evaluated first

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
