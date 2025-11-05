import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { JobExecution } from './job-execution.entity';

@Entity('scheduled_jobs')
export class ScheduledJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workspace_id' })
  workspaceId: string;

  @Column()
  name: string;

  @Column({ name: 'job_type' })
  jobType: 'DATA_SYNC' | 'AI_GENERATION' | 'REPORT_GENERATION' | 'ALERT_CHECK' | 'OUTCOME_CALCULATION' | 'CUSTOM';

  @Column()
  schedule: string; // Cron expression

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'jsonb', default: {} })
  configuration: Record<string, any>;

  @Column({ name: 'notify_on_failure', type: 'jsonb', nullable: true })
  notifyOnFailure: {
    email?: boolean;
    whatsapp?: boolean;
    slack?: boolean;
  };

  @Column({ name: 'notify_recipients', type: 'jsonb', default: [] })
  notifyRecipients: string[];

  @Column({ name: 'depends_on_job_id', nullable: true })
  dependsOnJobId: string;

  @ManyToOne(() => ScheduledJob, { nullable: true })
  @JoinColumn({ name: 'depends_on_job_id' })
  dependsOnJob: ScheduledJob;

  @Column({ name: 'dependency_delay_minutes', default: 0 })
  dependencyDelayMinutes: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => JobExecution, execution => execution.scheduledJob)
  executions: JobExecution[];
}
