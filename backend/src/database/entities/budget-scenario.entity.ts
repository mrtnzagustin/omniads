import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('budget_scenarios')
@Index(['workspaceId', 'status'])
export class BudgetScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalBudget: number;

  @Column({ type: 'jsonb' })
  allocations: Array<{
    channel: string;
    campaignId?: string;
    allocatedBudget: number;
    predictedROAS?: number;
    predictedRevenue?: number;
  }>;

  @Column({ nullable: true })
  goal: string; // 'MAXIMIZE_ROAS', 'MAXIMIZE_REVENUE', 'MAXIMIZE_CUSTOMERS'

  @Column({ type: 'jsonb', nullable: true })
  predictedOutcomes: {
    revenue?: number;
    roas?: number;
    conversions?: number;
    newCustomers?: number;
  };

  @Column({ default: 'DRAFT' })
  status: string; // 'DRAFT', 'ACTIVE', 'IMPLEMENTED', 'ARCHIVED'

  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
