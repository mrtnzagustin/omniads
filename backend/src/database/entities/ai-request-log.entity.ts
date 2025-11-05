import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('ai_request_logs')
export class AIRequestLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  provider: string; // 'anthropic' | 'openai'

  @Column()
  model: string;

  @Column({ nullable: true })
  promptTokens: number;

  @Column({ nullable: true })
  completionTokens: number;

  @Column({ nullable: true })
  totalTokens: number;

  @Column()
  latencyMs: number;

  @Column()
  success: boolean;

  @Column({ nullable: true, type: 'text' })
  errorMessage: string;

  @Column({ nullable: true })
  requestType: string; // 'recommendations' | 'summary' | 'insight'

  @CreateDateColumn()
  createdAt: Date;
}
