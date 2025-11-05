import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('ai_analyses')
@Index(['workspaceId', 'createdAt'])
@Index(['analysisType'])
export class AIAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  workspaceId: string;

  @Column()
  analysisType: string; // 'RECOMMENDATION' | 'SUMMARY' | 'INSIGHT'

  @Column()
  provider: string; // 'ANTHROPIC' | 'OPENAI'

  @Column()
  model: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'jsonb' })
  inputSnapshot: any; // Campaign/product data context

  @Column({ nullable: true })
  tokensUsed: number;

  @Column()
  latencyMs: number;

  @Column()
  status: string; // 'SUCCESS' | 'PARTIAL' | 'FAILED'

  @Column({ nullable: true, type: 'text' })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date; // For retention policies
}
