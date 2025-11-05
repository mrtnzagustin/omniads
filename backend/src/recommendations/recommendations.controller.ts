import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(private recommendationsService: RecommendationsService) {}

  @Get('recommendations/action-items')
  async getActionItems() {
    return this.recommendationsService.getActionItems();
  }

  @Post('recommendations/:id/archive')
  async archiveRecommendation(@Param('id') id: string) {
    return this.recommendationsService.archiveRecommendation(id);
  }

  @Get('opportunities/organic')
  async getOrganicOpportunities() {
    return this.recommendationsService.getOrganicOpportunities();
  }

  @Get('opportunities/bundles')
  async getBundleOpportunities() {
    return this.recommendationsService.getBundleOpportunities();
  }
}
