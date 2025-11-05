import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ScheduledJobsService,
  CreateScheduledJobDto,
  UpdateScheduledJobDto,
} from './scheduled-jobs.service';

@Controller('api/v1/scheduled-jobs')
export class ScheduledJobsController {
  constructor(private readonly scheduledJobsService: ScheduledJobsService) {}

  @Get()
  async listJobs(@Query('workspaceId') workspaceId: string) {
    return this.scheduledJobsService.listJobs(workspaceId);
  }

  @Post()
  async createJob(@Body() dto: CreateScheduledJobDto) {
    return this.scheduledJobsService.createJob(dto);
  }

  @Get(':id')
  async getJob(@Param('id') id: string) {
    return this.scheduledJobsService.getJob(id);
  }

  @Put(':id')
  async updateJob(@Param('id') id: string, @Body() dto: UpdateScheduledJobDto) {
    return this.scheduledJobsService.updateJob(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteJob(@Param('id') id: string) {
    await this.scheduledJobsService.deleteJob(id);
  }

  @Post(':id/pause')
  async pauseJob(@Param('id') id: string) {
    return this.scheduledJobsService.pauseJob(id);
  }

  @Post(':id/resume')
  async resumeJob(@Param('id') id: string) {
    return this.scheduledJobsService.resumeJob(id);
  }

  @Post(':id/trigger')
  async triggerJob(@Param('id') id: string, @Body('userId') userId?: string) {
    return this.scheduledJobsService.triggerJob(id, userId);
  }
}

@Controller('api/v1/job-executions')
export class JobExecutionsController {
  constructor(private readonly scheduledJobsService: ScheduledJobsService) {}

  @Get()
  async listExecutions(
    @Query('scheduledJobId') scheduledJobId?: string,
    @Query('workspaceId') workspaceId?: string,
    @Query('limit') limit?: string
  ) {
    return this.scheduledJobsService.listExecutions(
      scheduledJobId,
      workspaceId,
      limit ? parseInt(limit, 10) : 50
    );
  }

  @Get(':id')
  async getExecution(@Param('id') id: string) {
    return this.scheduledJobsService.getExecution(id);
  }

  @Post(':id/retry')
  async retryExecution(@Param('id') id: string) {
    return this.scheduledJobsService.retryExecution(id);
  }
}
