import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { DisplayAdTrackerService } from './display-ad-tracker.service';

@Controller('api/v1/display-ads')
export class DisplayAdTrackerController {
  constructor(private readonly displayAdService: DisplayAdTrackerService) {}

  @Post('discover/:competitorId')
  async discoverAds(@Param('competitorId') competitorId: string) {
    return this.displayAdService.discoverDisplayAds(competitorId);
  }

  @Get('competitor/:competitorId')
  async listDisplayAds(
    @Param('competitorId') competitorId: string,
    @Query('adNetwork') adNetwork?: string,
  ) {
    return this.displayAdService.listDisplayAds(competitorId, { adNetwork });
  }

  @Get('competitor/:competitorId/publishers')
  async getTopPublishers(@Param('competitorId') competitorId: string) {
    return this.displayAdService.getTopPublishers(competitorId);
  }
}
