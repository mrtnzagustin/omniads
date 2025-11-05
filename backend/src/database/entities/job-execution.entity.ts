import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ScheduledJob } from './scheduled-job.entity';

@Entity('job_executions')
export class JobExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'scheduled_job_id' })
  scheduledJobId: string;

  @ManyToOne(() => ScheduledJob, job => job.executions)
  @JoinColumn({ name: 'scheduled_job_id' })
  scheduledJob: ScheduledJob;

  @Column({ name: 'execution_number', type: 'bigint', default: 0 })
  executionNumber: number;

  @Column()
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT' | 'SKIPPED' | 'INTERRUPTED';

  @CreateDateColumn({ name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @Column({ name: 'duration_ms', nullable: true })
  durationMs: number;

  @Column({ name: 'input_parameters', type: 'jsonb', default: {} })
  inputParameters: Record<string, any>;

  @Column({ name: 'output_summary', type: 'jsonb', default: {} })
  outputSummary: Record<string, any>;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'retry_attempt', default: 0 })
  retryAttempt: number;

  @Column({ name: 'triggered_by' })
  triggeredBy: 'SCHEDULED' | 'MANUAL' | 'DEPENDENCY';

  @Column({ name: 'triggered_by_user_id', nullable: true })
  triggeredByUserId: string;
}
