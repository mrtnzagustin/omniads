import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CreativeFatigueService } from './creative-fatigue.service';

@Controller('api/v1/creative-fatigue')
export class CreativeFatigueController {
  constructor(private readonly fatigueService: CreativeFatigueService) {}

  @Get('analyze/:creativeId')
  async analyzeCreative(
    @Param('creativeId') creativeId: string,
    @Query('workspaceId') workspaceId: string,
  ) {
    return this.fatigueService.analyzeCreativeFatigue(workspaceId, creativeId);
  }

  @Post('track')
  async trackMetric(@Body() dto: any) {
    return this.fatigueService.trackCreativeMetric(dto);
  }

  @Get('fatigued')
  async getFatigued(@Query('workspaceId') workspaceId: string) {
    return this.fatigueService.getFatiguedCreatives(workspaceId);
  }
}
