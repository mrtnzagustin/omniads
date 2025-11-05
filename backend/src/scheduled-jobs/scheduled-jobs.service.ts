import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { ScheduledJob } from '../database/entities/scheduled-job.entity';
import { JobExecution } from '../database/entities/job-execution.entity';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DataSyncService } from '../services/data-sync.service';
import { AICoreClient } from '../services/ai-core.client';

export interface JobResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface CreateScheduledJobDto {
  workspaceId: string;
  name: string;
  jobType: 'DATA_SYNC' | 'AI_GENERATION' | 'REPORT_GENERATION' | 'ALERT_CHECK' | 'OUTCOME_CALCULATION' | 'CUSTOM';
  schedule: string;
  timezone?: string;
  enabled?: boolean;
  configuration?: Record<string, any>;
  notifyOnFailure?: {
    email?: boolean;
    whatsapp?: boolean;
    slack?: boolean;
  };
  notifyRecipients?: string[];
  dependsOnJobId?: string;
  dependencyDelayMinutes?: number;
  createdBy?: string;
}

export interface UpdateScheduledJobDto {
  name?: string;
  schedule?: string;
  timezone?: string;
  enabled?: boolean;
  configuration?: Record<string, any>;
  notifyOnFailure?: {
    email?: boolean;
    whatsapp?: boolean;
    slack?: boolean;
  };
  notifyRecipients?: string[];
  dependsOnJobId?: string;
  dependencyDelayMinutes?: number;
}

@Injectable()
export class ScheduledJobsService implements OnModuleInit {
  private readonly logger = new Logger(ScheduledJobsService.name);
  private jobLocks: Map<string, boolean> = new Map();
  private maxRetries: number;
  private retryDelays: number[]; // in minutes

  constructor(
    @InjectRepository(ScheduledJob)
    private scheduledJobRepository: Repository<ScheduledJob>,
    @InjectRepository(JobExecution)
    private jobExecutionRepository: Repository<JobExecution>,
    private schedulerRegistry: SchedulerRegistry,
    private dataSyncService: DataSyncService,
    private aiCoreClient: AICoreClient,
  ) {
    this.maxRetries = parseInt(process.env.SCHEDULER_MAX_RETRIES || '3', 10);
    const delays = process.env.SCHEDULER_RETRY_DELAYS || '5,15,30';
    this.retryDelays = delays.split(',').map(d => parseInt(d, 10));
  }

  async onModuleInit() {
    const enabled = process.env.SCHEDULER_ENABLED !== 'false';
    if (!enabled) {
      this.logger.log('Scheduler is disabled via SCHEDULER_ENABLED environment variable');
      return;
    }

    this.logger.log('Initializing scheduled jobs...');

    // Mark any running jobs as interrupted (in case of server restart)
    await this.markInterruptedJobs();

    // Load and register all enabled jobs
    await this.loadAndRegisterJobs();

    this.logger.log('Scheduled jobs initialized successfully');
  }

  private async markInterruptedJobs() {
    await this.jobExecutionRepository.update(
      { status: 'RUNNING' },
      { status: 'INTERRUPTED', completedAt: new Date() }
    );
  }

  private async loadAndRegisterJobs() {
    const jobs = await this.scheduledJobRepository.find({
      where: { enabled: true },
    });

    this.logger.log(`Loading ${jobs.length} enabled jobs`);

    for (const job of jobs) {
      try {
        await this.registerCronJob(job);
      } catch (error) {
        this.logger.error(`Failed to register job ${job.id}:`, error.message);
      }
    }
  }

  private async registerCronJob(job: ScheduledJob) {
    const cronExpression = job.schedule;
    const timezone = job.timezone || 'UTC';

    const cronJob = new CronJob(
      cronExpression,
      async () => {
        await this.executeJob(job.id, 'SCHEDULED', null);
      },
      null,
      true,
      timezone
    );

    try {
      this.schedulerRegistry.addCronJob(job.id, cronJob);
      this.logger.log(`Registered cron job: ${job.name} (${job.id}) - Schedule: ${cronExpression}`);
    } catch (error) {
      // Job might already exist, delete and re-add
      try {
        this.schedulerRegistry.deleteCronJob(job.id);
        this.schedulerRegistry.addCronJob(job.id, cronJob);
      } catch (e) {
        throw new Error(`Failed to register cron job: ${e.message}`);
      }
    }
  }

  private async executeJob(
    jobId: string,
    triggeredBy: 'SCHEDULED' | 'MANUAL' | 'DEPENDENCY',
    triggeredByUserId: string | null
  ): Promise<JobExecution> {
    // Check if job is locked (already running)
    if (this.jobLocks.get(jobId)) {
      this.logger.warn(`Job ${jobId} is already running, skipping execution`);

      const execution = this.jobExecutionRepository.create({
        scheduledJobId: jobId,
        status: 'SKIPPED',
        triggeredBy,
        triggeredByUserId,
        startedAt: new Date(),
        completedAt: new Date(),
        errorMessage: 'Job already running - execution skipped to prevent overlap',
      });

      return await this.jobExecutionRepository.save(execution);
    }

    // Acquire lock
    this.jobLocks.set(jobId, true);

    const job = await this.scheduledJobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      this.jobLocks.delete(jobId);
      throw new Error(`Job ${jobId} not found`);
    }

    // Create execution record
    const execution = this.jobExecutionRepository.create({
      scheduledJobId: jobId,
      status: 'RUNNING',
      triggeredBy,
      triggeredByUserId,
      startedAt: new Date(),
      inputParameters: job.configuration,
    });

    const savedExecution = await this.jobExecutionRepository.save(execution);
    const startTime = Date.now();

    try {
      // Execute job based on type
      const result = await this.executeJobHandler(job);

      // Update execution as successful
      savedExecution.status = 'SUCCESS';
      savedExecution.completedAt = new Date();
      savedExecution.durationMs = Date.now() - startTime;
      savedExecution.outputSummary = result.data || { message: result.message };

      await this.jobExecutionRepository.save(savedExecution);

      // Release lock
      this.jobLocks.delete(jobId);

      // Trigger dependent jobs if any
      await this.triggerDependentJobs(jobId);

      this.logger.log(`Job ${job.name} (${jobId}) completed successfully in ${savedExecution.durationMs}ms`);

      return savedExecution;
    } catch (error) {
      // Update execution as failed
      savedExecution.status = 'FAILED';
      savedExecution.completedAt = new Date();
      savedExecution.durationMs = Date.now() - startTime;
      savedExecution.errorMessage = error.message;

      await this.jobExecutionRepository.save(savedExecution);

      // Release lock
      this.jobLocks.delete(jobId);

      // Handle retry logic
      if (savedExecution.retryAttempt < this.maxRetries) {
        const delayMinutes = this.retryDelays[savedExecution.retryAttempt] || 30;
        this.logger.warn(`Job ${job.name} failed, will retry in ${delayMinutes} minutes (attempt ${savedExecution.retryAttempt + 1}/${this.maxRetries})`);

        setTimeout(async () => {
          const retryExecution = this.jobExecutionRepository.create({
            ...savedExecution,
            id: undefined,
            retryAttempt: savedExecution.retryAttempt + 1,
            status: 'RUNNING',
            startedAt: new Date(),
          });
          await this.executeJob(jobId, triggeredBy, triggeredByUserId);
        }, delayMinutes * 60 * 1000);
      } else {
        // All retries exhausted, send notification
        this.logger.error(`Job ${job.name} failed after ${this.maxRetries} retries`);
        await this.sendFailureNotification(job, savedExecution);
      }

      return savedExecution;
    }
  }

  private async executeJobHandler(job: ScheduledJob): Promise<JobResult> {
    this.logger.log(`Executing job: ${job.name} (${job.jobType})`);

    switch (job.jobType) {
      case 'DATA_SYNC':
        return await this.handleDataSync(job);

      case 'AI_GENERATION':
        return await this.handleAIGeneration(job);

      case 'REPORT_GENERATION':
        return await this.handleReportGeneration(job);

      case 'ALERT_CHECK':
        return await this.handleAlertCheck(job);

      case 'OUTCOME_CALCULATION':
        return await this.handleOutcomeCalculation(job);

      default:
        throw new Error(`Unknown job type: ${job.jobType}`);
    }
  }

  private async handleDataSync(job: ScheduledJob): Promise<JobResult> {
    const result = await this.dataSyncService.syncAllPlatforms(job.workspaceId);
    return {
      success: true,
      message: 'Data sync completed',
      data: result,
    };
  }

  private async handleAIGeneration(job: ScheduledJob): Promise<JobResult> {
    // This would typically call AI generation service
    // For now, returning a placeholder
    this.logger.log(`AI generation for workspace ${job.workspaceId} would run here`);
    return {
      success: true,
      message: 'AI generation completed',
      data: { recommendationsGenerated: 0 },
    };
  }

  private async handleReportGeneration(job: ScheduledJob): Promise<JobResult> {
    // Report generation logic would go here
    this.logger.log(`Report generation for workspace ${job.workspaceId} would run here`);
    return {
      success: true,
      message: 'Report generated',
      data: { reportUrl: 'https://example.com/report.pdf' },
    };
  }

  private async handleAlertCheck(job: ScheduledJob): Promise<JobResult> {
    // Alert checking logic would go here
    this.logger.log(`Alert check for workspace ${job.workspaceId} would run here`);
    return {
      success: true,
      message: 'Alerts checked',
      data: { alertsTriggered: 0 },
    };
  }

  private async handleOutcomeCalculation(job: ScheduledJob): Promise<JobResult> {
    // Outcome calculation logic would go here
    this.logger.log(`Outcome calculation for workspace ${job.workspaceId} would run here`);
    return {
      success: true,
      message: 'Outcomes calculated',
      data: { outcomesCalculated: 0 },
    };
  }

  private async triggerDependentJobs(completedJobId: string) {
    const dependentJobs = await this.scheduledJobRepository.find({
      where: {
        dependsOnJobId: completedJobId,
        enabled: true,
      },
    });

    for (const dependentJob of dependentJobs) {
      const delayMs = (dependentJob.dependencyDelayMinutes || 0) * 60 * 1000;

      if (delayMs > 0) {
        this.logger.log(`Scheduling dependent job ${dependentJob.name} to run in ${dependentJob.dependencyDelayMinutes} minutes`);
        setTimeout(() => {
          this.executeJob(dependentJob.id, 'DEPENDENCY', null);
        }, delayMs);
      } else {
        this.logger.log(`Triggering dependent job ${dependentJob.name} immediately`);
        await this.executeJob(dependentJob.id, 'DEPENDENCY', null);
      }
    }
  }

  private async sendFailureNotification(job: ScheduledJob, execution: JobExecution) {
    this.logger.error(`Sending failure notification for job ${job.name}`);
    // Notification logic would go here
    // This would integrate with email/WhatsApp/Slack services
  }

  // Public API methods
  async createJob(dto: CreateScheduledJobDto): Promise<ScheduledJob> {
    const job = this.scheduledJobRepository.create(dto);
    const savedJob = await this.scheduledJobRepository.save(job);

    if (savedJob.enabled) {
      await this.registerCronJob(savedJob);
    }

    return savedJob;
  }

  async updateJob(id: string, dto: UpdateScheduledJobDto): Promise<ScheduledJob> {
    await this.scheduledJobRepository.update(id, dto);
    const job = await this.scheduledJobRepository.findOne({ where: { id } });

    if (!job) {
      throw new Error(`Job ${id} not found`);
    }

    // Re-register cron job if schedule changed
    if (dto.schedule || dto.timezone || dto.enabled !== undefined) {
      try {
        this.schedulerRegistry.deleteCronJob(id);
      } catch (e) {
        // Job might not exist, that's ok
      }

      if (job.enabled) {
        await this.registerCronJob(job);
      }
    }

    return job;
  }

  async deleteJob(id: string): Promise<void> {
    try {
      this.schedulerRegistry.deleteCronJob(id);
    } catch (e) {
      // Job might not be registered, that's ok
    }

    await this.scheduledJobRepository.delete(id);
  }

  async pauseJob(id: string): Promise<ScheduledJob> {
    return this.updateJob(id, { enabled: false });
  }

  async resumeJob(id: string): Promise<ScheduledJob> {
    return this.updateJob(id, { enabled: true });
  }

  async triggerJob(id: string, userId?: string): Promise<JobExecution> {
    return this.executeJob(id, 'MANUAL', userId);
  }

  async listJobs(workspaceId: string): Promise<ScheduledJob[]> {
    return this.scheduledJobRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
    });
  }

  async getJob(id: string): Promise<ScheduledJob> {
    const job = await this.scheduledJobRepository.findOne({ where: { id } });
    if (!job) {
      throw new Error(`Job ${id} not found`);
    }
    return job;
  }

  async listExecutions(
    scheduledJobId?: string,
    workspaceId?: string,
    limit: number = 50
  ): Promise<JobExecution[]> {
    const query = this.jobExecutionRepository.createQueryBuilder('execution')
      .leftJoinAndSelect('execution.scheduledJob', 'job')
      .orderBy('execution.startedAt', 'DESC')
      .limit(limit);

    if (scheduledJobId) {
      query.andWhere('execution.scheduledJobId = :scheduledJobId', { scheduledJobId });
    }

    if (workspaceId) {
      query.andWhere('job.workspaceId = :workspaceId', { workspaceId });
    }

    return query.getMany();
  }

  async getExecution(id: string): Promise<JobExecution> {
    const execution = await this.jobExecutionRepository.findOne({
      where: { id },
      relations: ['scheduledJob'],
    });

    if (!execution) {
      throw new Error(`Execution ${id} not found`);
    }

    return execution;
  }

  async retryExecution(id: string): Promise<JobExecution> {
    const execution = await this.getExecution(id);
    if (execution.status !== 'FAILED') {
      throw new Error('Can only retry failed executions');
    }

    return this.executeJob(execution.scheduledJobId, 'MANUAL', null);
  }
}
