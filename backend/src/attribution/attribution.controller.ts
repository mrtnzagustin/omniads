import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { AttributionService } from './attribution.service';

@Controller('api/v1/attribution')
export class AttributionController {
  constructor(private readonly attributionService: AttributionService) {}

  @Post('track')
  async trackTouchpoint(@Body() body: {
    userId: string;
    channel: string;
    campaignId?: string;
    adId?: string;
    sessionId: string;
    eventType: 'IMPRESSION' | 'CLICK' | 'VIEW';
    metadata?: Record<string, any>;
  }) {
    return this.attributionService.trackTouchpoint(body);
  }

  @Post('conversion')
  async recordConversion(@Body() body: {
    userId: string;
    workspaceId: string;
    revenue: number;
    lookbackDays?: number;
  }) {
    return this.attributionService.recordConversion(
      body.userId,
      body.workspaceId,
      body.revenue,
      body.lookbackDays
    );
  }

  @Post('calculate')
  async calculateAttribution(@Body() body: {
    workspaceId: string;
    startDate: string;
    endDate: string;
  }) {
    return this.attributionService.calculateAttribution(
      body.workspaceId,
      new Date(body.startDate),
      new Date(body.endDate)
    );
  }

  @Get('results')
  async getResults(@Query() query: {
    workspaceId: string;
    model: 'LAST_CLICK' | 'FIRST_CLICK' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED';
    startDate: string;
    endDate: string;
  }) {
    return this.attributionService.getAttributionResults(
      query.workspaceId,
      query.model,
      new Date(query.startDate),
      new Date(query.endDate)
    );
  }

  @Get('journey-paths')
  async getJourneyPaths(@Query() query: {
    workspaceId: string;
    startDate: string;
    endDate: string;
    limit?: string;
  }) {
    return this.attributionService.getTopJourneyPaths(
      query.workspaceId,
      new Date(query.startDate),
      new Date(query.endDate),
      query.limit ? parseInt(query.limit, 10) : 20
    );
  }
}
