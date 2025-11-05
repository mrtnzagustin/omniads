import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { BudgetRebalancerService } from './budget-rebalancer.service';
import { BudgetRecommendationStatus } from '../database/entities/budget-recommendation.entity';

@Controller('budget-rebalancer')
export class BudgetRebalancerController {
  constructor(
    private readonly budgetRebalancerService: BudgetRebalancerService,
  ) {}

  @Get('recommendations')
  async getRecommendations(@Query('status') status?: BudgetRecommendationStatus) {
    return this.budgetRebalancerService.getRecommendations(status);
  }

  @Post('recommendations/:id/approve')
  async approveRecommendation(
    @Param('id') id: string,
    @Body() body: { userId: string; actualDelta?: number },
  ) {
    return this.budgetRebalancerService.approveRecommendation(
      id,
      body.userId,
      body.actualDelta,
    );
  }

  @Post('recommendations/:id/reject')
  async rejectRecommendation(@Param('id') id: string) {
    return this.budgetRebalancerService.rejectRecommendation(id);
  }

  @Get('adjustments')
  async getAdjustments() {
    return this.budgetRebalancerService.getAdjustments();
  }

  @Post('adjustments/:id/dispatch')
  async dispatchAdjustment(@Param('id') id: string) {
    return this.budgetRebalancerService.dispatchAdjustment(id);
  }

  @Get('automation-rules')
  async getAutomationRules(@Query('workspaceId') workspaceId: string) {
    return this.budgetRebalancerService.getAutomationRules(
      workspaceId || 'default',
    );
  }

  @Post('automation-rules')
  async createAutomationRule(@Body() data: any) {
    return this.budgetRebalancerService.createAutomationRule(data);
  }

  @Put('automation-rules/:id')
  async updateAutomationRule(@Param('id') id: string, @Body() data: any) {
    return this.budgetRebalancerService.updateAutomationRule(id, data);
  }
}
