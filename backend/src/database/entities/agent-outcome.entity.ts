import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('agent_outcomes')
export class AgentOutcome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  decisionId: string;

  @Column()
  workspaceId: string;

  @Column({ type: 'jsonb' })
  predictedOutcome: any;

  @Column({ type: 'jsonb' })
  actualOutcome: any;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  accuracyScore: number;

  @Column({ type: 'text', nullable: true })
  analysis: string;

  @CreateDateColumn()
  createdAt: Date;
}
