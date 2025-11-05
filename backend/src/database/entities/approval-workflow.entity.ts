import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('approval_workflows')
@Index(['workspaceId', 'entityType'])
export class ApprovalWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column()
  entityType: string; // 'BUDGET_CHANGE', 'CAMPAIGN_LAUNCH', 'CREATIVE_APPROVAL'

  @Column({ type: 'jsonb' })
  rules: Array<{
    field: string;
    operator: string;
    value: any;
  }>;

  @Column({ type: 'jsonb' })
  approvers: Array<{
    level: number;
    userIds: string[];
    requireAll?: boolean;
  }>;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
