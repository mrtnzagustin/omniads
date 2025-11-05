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
  ForecastingService,
  CreateScenarioDto,
  CreateSeasonalEventDto,
} from './forecasting.service';

@Controller('api/v1/forecasting')
export class ForecastingController {
  constructor(private readonly forecastingService: ForecastingService) {}

  @Post('generate')
  async generateForecasts(
    @Body('workspaceId') workspaceId: string,
    @Body('horizonDays') horizonDays?: number,
  ) {
    return this.forecastingService.generateForecasts(workspaceId, horizonDays || 30);
  }

  @Get()
  async getForecasts(
    @Query('workspaceId') workspaceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('metricType') metricType?: string,
  ) {
    return this.forecastingService.getForecasts(
      workspaceId,
      new Date(startDate),
      new Date(endDate),
      metricType,
    );
  }

  @Get('latest')
  async getLatestForecasts(
    @Query('workspaceId') workspaceId: string,
    @Query('horizonDays') horizonDays?: string,
  ) {
    return this.forecastingService.getLatestForecasts(
      workspaceId,
      horizonDays ? parseInt(horizonDays, 10) : 30,
    );
  }

  @Get('accuracy')
  async getForecastAccuracy(
    @Query('workspaceId') workspaceId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.forecastingService.getForecastAccuracy(
      workspaceId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Post('evaluate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async evaluateForecastAccuracy(
    @Body('workspaceId') workspaceId: string,
    @Body('targetDate') targetDate: string,
  ) {
    await this.forecastingService.evaluateForecastAccuracy(workspaceId, new Date(targetDate));
  }
}

@Controller('api/v1/forecast-scenarios')
export class ForecastScenariosController {
  constructor(private readonly forecastingService: ForecastingService) {}

  @Get()
  async listScenarios(@Query('workspaceId') workspaceId: string) {
    return this.forecastingService.listScenarios(workspaceId);
  }

  @Post()
  async createScenario(@Body() dto: CreateScenarioDto) {
    return this.forecastingService.createScenario(dto);
  }

  @Get(':id')
  async getScenario(@Param('id') id: string) {
    return this.forecastingService.getScenario(id);
  }

  @Post(':id/calculate')
  async calculateScenario(@Param('id') id: string) {
    return this.forecastingService.calculateScenario(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteScenario(@Param('id') id: string) {
    await this.forecastingService.deleteScenario(id);
  }
}

@Controller('api/v1/seasonal-events')
export class SeasonalEventsController {
  constructor(private readonly forecastingService: ForecastingService) {}

  @Get()
  async listSeasonalEvents(@Query('workspaceId') workspaceId: string) {
    return this.forecastingService.listSeasonalEvents(workspaceId);
  }

  @Post()
  async createSeasonalEvent(@Body() dto: CreateSeasonalEventDto) {
    return this.forecastingService.createSeasonalEvent(dto);
  }

  @Put(':id')
  async updateSeasonalEvent(
    @Param('id') id: string,
    @Body() updates: Partial<CreateSeasonalEventDto>,
  ) {
    return this.forecastingService.updateSeasonalEvent(id, updates);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSeasonalEvent(@Param('id') id: string) {
    await this.forecastingService.deleteSeasonalEvent(id);
  }
}
