import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AIAgenticCampaignService } from './ai-agentic-campaign.service';
import { Workspace } from '../decorators/workspace.decorator';

@Controller('api/v1/ai-agents')
@UseGuards(JwtAuthGuard)
export class AIAgenticCampaignController {
  constructor(private readonly service: AIAgenticCampaignService) {}

  @Post()
  createAgent(@Workspace() workspaceId: string, @Body() data: any) {
    return this.service.createAgent(workspaceId, data);
  }

  @Get()
  findAllAgents(@Workspace() workspaceId: string) {
    return this.service.findAllAgents(workspaceId);
  }

  @Get(':id')
  findAgent(@Workspace() workspaceId: string, @Param('id') id: string) {
    return this.service.findAgent(workspaceId, id);
  }

  @Put(':id')
  updateAgent(@Workspace() workspaceId: string, @Param('id') id: string, @Body() data: any) {
    return this.service.updateAgent(workspaceId, id, data);
  }

  @Delete(':id')
  deleteAgent(@Workspace() workspaceId: string, @Param('id') id: string) {
    return this.service.deleteAgent(workspaceId, id);
  }

  @Get(':id/decisions')
  getAgentDecisions(@Workspace() workspaceId: string, @Param('id') agentId: string, @Query('limit') limit?: number) {
    return this.service.getAgentDecisions(workspaceId, agentId, limit);
  }

  @Post('decisions')
  createDecision(@Workspace() workspaceId: string, @Body() data: any) {
    return this.service.createDecision(workspaceId, data);
  }

  @Get('decisions/:id/outcomes')
  getDecisionOutcomes(@Workspace() workspaceId: string, @Param('id') decisionId: string) {
    return this.service.getDecisionOutcomes(workspaceId, decisionId);
  }

  @Post('outcomes')
  trackOutcome(@Workspace() workspaceId: string, @Body() data: any) {
    return this.service.trackOutcome(workspaceId, data);
  }
}
