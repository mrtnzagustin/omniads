import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApprovalWorkflowsService } from './approval-workflows.service';

@Controller('api/v1/approvals')
export class ApprovalWorkflowsController {
  constructor(private readonly approvalService: ApprovalWorkflowsService) {}

  @Post('workflows')
  async createWorkflow(@Body() dto: any) {
    return this.approvalService.createWorkflow(dto);
  }

  @Post('requests')
  async createRequest(@Body() dto: any) {
    return this.approvalService.createApprovalRequest(dto);
  }

  @Post('requests/:id/approve')
  async approve(
    @Param('id') id: string,
    @Body('approverId') approverId: string,
    @Body('comments') comments?: string,
  ) {
    return this.approvalService.approveRequest(id, approverId, comments);
  }

  @Get('requests')
  async listRequests(
    @Query('workspaceId') workspaceId: string,
    @Query('status') status?: string,
  ) {
    return this.approvalService.listRequests(workspaceId, status);
  }
}
