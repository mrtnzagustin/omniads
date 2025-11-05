import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalWorkflow } from '../database/entities/approval-workflow.entity';
import { ApprovalRequest } from '../database/entities/approval-request.entity';

@Injectable()
export class ApprovalWorkflowsService {
  constructor(
    @InjectRepository(ApprovalWorkflow)
    private workflowRepository: Repository<ApprovalWorkflow>,
    @InjectRepository(ApprovalRequest)
    private requestRepository: Repository<ApprovalRequest>,
  ) {}

  async createWorkflow(dto: any): Promise<ApprovalWorkflow> {
    return this.workflowRepository.save(this.workflowRepository.create(dto));
  }

  async createApprovalRequest(dto: any): Promise<ApprovalRequest> {
    const workflow = await this.workflowRepository.findOne({ where: { id: dto.workflowId } });

    const request = this.requestRepository.create({
      ...dto,
      currentLevel: 1,
      status: 'PENDING',
    });

    const saved = await this.requestRepository.save(request);

    // Notify first-level approvers
    await this.notifyApprovers(saved, workflow);

    return saved;
  }

  private async notifyApprovers(request: ApprovalRequest, workflow: ApprovalWorkflow): Promise<void> {
    const levelApprovers = workflow.approvers.find(a => a.level === request.currentLevel);
    // Send notifications to approvers
    console.log(`Notifying approvers: ${levelApprovers?.userIds.join(', ')}`);
  }

  async approveRequest(requestId: string, approverId: string, comments?: string): Promise<ApprovalRequest> {
    const request = await this.requestRepository.findOne({ where: { id: requestId } });
    const workflow = await this.workflowRepository.findOne({ where: { id: request.workflowId } });

    // Check if there are more levels
    const nextLevel = request.currentLevel + 1;
    const hasNextLevel = workflow.approvers.some(a => a.level === nextLevel);

    if (hasNextLevel) {
      request.currentLevel = nextLevel;
      request.status = 'PENDING';
      await this.requestRepository.save(request);
      await this.notifyApprovers(request, workflow);
    } else {
      request.status = 'APPROVED';
      request.completedAt = new Date();
      await this.requestRepository.save(request);
    }

    return request;
  }

  async listRequests(workspaceId: string, status?: string): Promise<ApprovalRequest[]> {
    const where: any = { workspaceId };
    if (status) where.status = status;

    return this.requestRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }
}
