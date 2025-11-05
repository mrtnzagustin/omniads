import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExportJob } from '../database/entities/export-job.entity';

@Injectable()
export class ExportEngineService {
  private readonly logger = new Logger(ExportEngineService.name);

  constructor(
    @InjectRepository(ExportJob)
    private exportJobRepository: Repository<ExportJob>,
  ) {}

  async createExportJob(workspaceId: string, userId: string, format: string, config: any): Promise<ExportJob> {
    const job = this.exportJobRepository.create({
      workspaceId,
      userId,
      format,
      configuration: config,
      status: 'PENDING',
    });

    const saved = await this.exportJobRepository.save(job);

    // Queue processing job (in production, use Bull queue)
    setTimeout(() => this.processExport(saved.id), 100);

    return saved;
  }

  private async processExport(jobId: string): Promise<void> {
    this.logger.log(`Processing export job ${jobId}`);

    try {
      await this.exportJobRepository.update(jobId, { status: 'PROCESSING' });

      // Simulate export generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const downloadUrl = `https://storage.example.com/exports/${jobId}.pdf`;

      await this.exportJobRepository.update(jobId, {
        status: 'COMPLETED',
        downloadUrl,
      });

      this.logger.log(`Export job ${jobId} completed`);
    } catch (error) {
      await this.exportJobRepository.update(jobId, {
        status: 'FAILED',
        errorMessage: error.message,
      });
    }
  }

  async listExports(workspaceId: string): Promise<ExportJob[]> {
    return this.exportJobRepository.find({
      where: { workspaceId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
