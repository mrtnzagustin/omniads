import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationWorkflowService } from './recommendation-workflow.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/v1')
@UseGuards(JwtAuthGuard)
export class RecommendationsController {
  constructor(
    private recommendationsService: RecommendationsService,
    private workflowService: RecommendationWorkflowService,
  ) {}

  @Get('recommendations/action-items')
  async getActionItems() {
    return this.recommendationsService.getActionItems();
  }

  @Post('recommendations/:id/archive')
  async archiveRecommendation(@Param('id') id: string) {
    return this.recommendationsService.archiveRecommendation(id);
  }

  // Workflow endpoints
  @Post('recommendations/:id/assign')
  async assignOwner(@Param('id') id: string, @Body() body: { ownerId: string; dueDate?: Date }) {
    return this.workflowService.assignOwner(id, body.ownerId, body.dueDate);
  }

  @Put('recommendations/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; userId: string; notes?: string },
  ) {
    return this.workflowService.updateStatus(id, body.status as any, body.userId, body.notes);
  }

  @Put('recommendations/:id/priority')
  async setPriority(@Param('id') id: string, @Body() body: { priority: string }) {
    return this.workflowService.setPriority(id, body.priority as any);
  }

  @Get('recommendations/:id/activities')
  async getActivities(@Param('id') id: string) {
    return this.workflowService.getActivities(id);
  }

  @Get('workflow/analytics')
  async getWorkflowAnalytics(@Query('workspaceId') workspaceId?: string) {
    return this.workflowService.getWorkflowAnalytics(workspaceId);
  }

  @Get('workflow/tasks')
  async getTasks(@Query() filters: any) {
    return this.workflowService.getTasks(filters);
  }

  @Put('workflow/tasks/:id')
  async updateTask(@Param('id') id: string, @Body() updates: any) {
    return this.workflowService.updateTask(id, updates);
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
