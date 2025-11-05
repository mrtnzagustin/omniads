import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { KeywordIntelligenceService } from './keyword-intelligence.service';

@Controller('api/v1/keywords')
export class KeywordIntelligenceController {
  constructor(private readonly keywordService: KeywordIntelligenceService) {}

  @Post('discover')
  async discoverKeywords(
    @Body('workspaceId') workspaceId: string,
    @Body('seedKeyword') seedKeyword: string,
  ) {
    return this.keywordService.discoverKeywords(workspaceId, seedKeyword);
  }

  @Get()
  async listKeywords(
    @Query('workspaceId') workspaceId: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.keywordService.listKeywords(workspaceId, sortBy);
  }

  @Post('recommendations/generate')
  async generateRecommendations(
    @Body('workspaceId') workspaceId: string,
    @Body('campaignId') campaignId?: string,
  ) {
    return this.keywordService.generateBiddingRecommendations(workspaceId, campaignId);
  }

  @Get('recommendations')
  async listRecommendations(
    @Query('workspaceId') workspaceId: string,
    @Query('status') status?: string,
  ) {
    return this.keywordService.listRecommendations(workspaceId, status);
  }

  @Post('recommendations/:id/apply')
  async applyRecommendation(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ) {
    return this.keywordService.applyRecommendation(id, userId);
  }
}
