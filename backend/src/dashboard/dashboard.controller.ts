import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('kpis')
  async getKpis(@Query('period') period: string = '7d') {
    return this.dashboardService.getKpis(period);
  }

  @Get('roas-trends')
  async getRoasTrends(@Query('period') period: string = '30d') {
    return this.dashboardService.getRoasTrends(period);
  }

  @Get('platform-summary')
  async getPlatformSummary(@Query('period') period: string = '7d') {
    return this.dashboardService.getPlatformSummary(period);
  }

  @Get('campaigns/top')
  async getTopCampaigns(@Query('period') period: string = '7d') {
    return this.dashboardService.getTopCampaigns(period);
  }

  @Get('campaigns/bottom')
  async getBottomCampaigns(@Query('period') period: string = '7d') {
    return this.dashboardService.getBottomCampaigns(period);
  }

  @Get('insight')
  getGlobalInsight() {
    return this.dashboardService.getGlobalInsight();
  }
}
