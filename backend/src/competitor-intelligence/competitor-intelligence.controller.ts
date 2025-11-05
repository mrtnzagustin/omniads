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
  CompetitorIntelligenceService,
  CreateCompetitorDto,
  UpdateCompetitorDto,
  CreateCompetitorAlertDto,
} from './competitor-intelligence.service';

@Controller('api/v1/competitors')
export class CompetitorsController {
  constructor(private readonly competitorService: CompetitorIntelligenceService) {}

  @Get()
  async listCompetitors(
    @Query('workspaceId') workspaceId: string,
    @Query('status') status?: string,
  ) {
    return this.competitorService.listCompetitors(workspaceId, status);
  }

  @Post()
  async createCompetitor(@Body() dto: CreateCompetitorDto) {
    return this.competitorService.createCompetitor(dto);
  }

  @Get(':id')
  async getCompetitor(@Param('id') id: string) {
    return this.competitorService.getCompetitor(id);
  }

  @Put(':id')
  async updateCompetitor(@Param('id') id: string, @Body() dto: UpdateCompetitorDto) {
    return this.competitorService.updateCompetitor(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCompetitor(@Param('id') id: string) {
    await this.competitorService.deleteCompetitor(id);
  }

  @Post(':id/discover')
  async discoverAds(@Param('id') id: string) {
    return this.competitorService.discoverAdsForCompetitor(id);
  }

  @Get(':id/ads')
  async listCompetitorAds(
    @Param('id') id: string,
    @Query('platform') platform?: string,
    @Query('format') format?: string,
    @Query('status') status?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.competitorService.listCompetitorAds(id, {
      platform,
      format,
      status,
      sortBy,
      sortOrder,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get(':id/spend-estimates')
  async getSpendEstimates(
    @Param('id') id: string,
    @Query('startMonth') startMonth: string,
    @Query('endMonth') endMonth: string,
  ) {
    return this.competitorService.getSpendEstimates(
      id,
      new Date(startMonth),
      new Date(endMonth),
    );
  }

  @Post(':id/calculate-spend')
  @HttpCode(HttpStatus.NO_CONTENT)
  async calculateSpendEstimates(
    @Param('id') id: string,
    @Body('month') month: string,
  ) {
    await this.competitorService.calculateSpendEstimates(id, new Date(month));
  }
}

@Controller('api/v1/competitor-ads')
export class CompetitorAdsController {
  constructor(private readonly competitorService: CompetitorIntelligenceService) {}

  @Get(':id')
  async getCompetitorAd(@Param('id') id: string) {
    return this.competitorService.getCompetitorAd(id);
  }
}

@Controller('api/v1/competitor-alerts')
export class CompetitorAlertsController {
  constructor(private readonly competitorService: CompetitorIntelligenceService) {}

  @Get()
  async listAlerts(
    @Query('workspaceId') workspaceId: string,
    @Query('competitorId') competitorId?: string,
  ) {
    return this.competitorService.listAlerts(workspaceId, competitorId);
  }

  @Post()
  async createAlert(@Body() dto: CreateCompetitorAlertDto) {
    return this.competitorService.createAlert(dto);
  }

  @Put(':id')
  async updateAlert(
    @Param('id') id: string,
    @Body() updates: Partial<CreateCompetitorAlertDto>,
  ) {
    return this.competitorService.updateAlert(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlert(@Param('id') id: string) {
    await this.competitorService.deleteAlert(id);
  }
}
