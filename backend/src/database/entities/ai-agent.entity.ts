import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('ai_agents')
export class AIAgent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  goals: {
    type: 'roas' | 'cpa' | 'spend' | 'conversions';
    target: number;
    min?: number;
    max?: number;
  }[];

  @Column({ type: 'jsonb' })
  constraints: {
    maxBudgetChange: number;
    maxBidChange: number;
    minConfidenceScore: number;
    allowedActions: string[];
  };

  @Column({ type: 'int', default: 5 })
  priority: number;

  @Column({ type: 'enum', enum: ['active', 'paused', 'terminated'], default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  performance: {
    decisionsCount: number;
    successRate: number;
    avgConfidence: number;
    lastAction: Date;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
