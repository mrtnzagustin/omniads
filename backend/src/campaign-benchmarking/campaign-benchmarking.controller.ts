import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CampaignBenchmarkingService } from './campaign-benchmarking.service';

@Controller('api/v1/benchmarks')
export class CampaignBenchmarkingController {
  constructor(private readonly benchmarkService: CampaignBenchmarkingService) {}

  @Get()
  async getBenchmarks(
    @Query('industry') industry: string,
    @Query('campaignType') campaignType: string,
    @Query('region') region: string,
  ) {
    return this.benchmarkService.getBenchmarks(industry, campaignType, region);
  }

  @Post('compare')
  async compare(@Body() dto: any) {
    return this.benchmarkService.compareToBenchmark(
      dto.metrics,
      dto.industry,
      dto.campaignType,
      dto.region,
    );
  }

  @Post('custom')
  async createCustom(@Body() dto: any) {
    return this.benchmarkService.createCustomBenchmark(dto);
  }
}
