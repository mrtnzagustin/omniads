import { Controller, Get, Query } from '@nestjs/common';
import { GeoAnalyticsService } from './geo-analytics.service';

@Controller('api/v1/geo-analytics')
export class GeoAnalyticsController {
  constructor(private readonly geoService: GeoAnalyticsService) {}

  @Get('performance')
  async getPerformance(
    @Query('workspaceId') workspaceId: string,
    @Query('level') level: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.geoService.getGeoPerformance(workspaceId, level, new Date(startDate), new Date(endDate));
  }

  @Get('recommendations')
  async getRecommendations(@Query('workspaceId') workspaceId: string) {
    return this.geoService.getGeoRecommendations(workspaceId);
  }
}
