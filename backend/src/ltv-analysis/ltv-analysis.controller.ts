import { Controller, Get, Query } from '@nestjs/common';
import { LTVAnalysisService } from './ltv-analysis.service';

@Controller('api/v1/ltv')
export class LTVAnalysisController {
  constructor(private readonly ltvService: LTVAnalysisService) {}

  @Get('by-channel')
  async getLTVByChannel(@Query('workspaceId') workspaceId: string) {
    return this.ltvService.getLTVByChannel(workspaceId);
  }

  @Get('cohorts')
  async getCohorts(@Query('workspaceId') workspaceId: string) {
    return this.ltvService.calculateCohortRetention(workspaceId);
  }
}
