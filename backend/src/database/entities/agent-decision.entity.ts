import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { AIAgent } from './ai-agent.entity';

@Entity('agent_decisions')
export class AgentDecision {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentId: string;

  @Column()
  workspaceId: string;

  @Column()
  campaignId: string;

  @Column({ type: 'enum', enum: ['budget_change', 'bid_change', 'pause_campaign', 'activate_campaign', 'targeting_change'] })
  actionType: string;

  @Column({ type: 'jsonb' })
  actionDetails: any;

  @Column({ type: 'text' })
  reasoning: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  confidenceScore: number;

  @Column({ type: 'jsonb', nullable: true })
  predictedOutcome: {
    metric: string;
    predictedValue: number;
    timeframe: string;
  };

  @Column({ type: 'enum', enum: ['pending', 'executed', 'failed', 'reverted'], default: 'pending' })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  executedAt: Date;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @CreateDateColumn()
  createdAt: Date;
}
