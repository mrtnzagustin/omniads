import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalWorkflow } from '../database/entities/approval-workflow.entity';
import { ApprovalRequest } from '../database/entities/approval-request.entity';
import { ApprovalWorkflowsService } from './approval-workflows.service';
import { ApprovalWorkflowsController } from './approval-workflows.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalWorkflow, ApprovalRequest])],
  controllers: [ApprovalWorkflowsController],
  providers: [ApprovalWorkflowsService],
  exports: [ApprovalWorkflowsService],
})
export class ApprovalWorkflowsModule {}
