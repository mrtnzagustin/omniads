import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Recommendation,
  RecommendationStatus,
  RecommendationPriority,
} from '../database/entities/recommendation.entity';
import { RecommendationActivity } from '../database/entities/recommendation-activity.entity';
import { AutomationPlaybook } from '../database/entities/automation-playbook.entity';
import { Task, TaskStatus } from '../database/entities/task.entity';

@Injectable()
export class RecommendationWorkflowService {
  constructor(
    @InjectRepository(Recommendation)
    private recommendationRepo: Repository<Recommendation>,
    @InjectRepository(RecommendationActivity)
    private activityRepo: Repository<RecommendationActivity>,
    @InjectRepository(AutomationPlaybook)
    private playbookRepo: Repository<AutomationPlaybook>,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async assignOwner(recommendationId: string, ownerId: string, dueDate?: Date) {
    const recommendation = await this.recommendationRepo.findOne({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    const oldStatus = recommendation.status;
    recommendation.ownerId = ownerId;
    recommendation.status = RecommendationStatus.IN_PROGRESS;
    if (dueDate) {
      recommendation.dueDate = dueDate;
    }

    await this.recommendationRepo.save(recommendation);

    // Log activity
    await this.activityRepo.save({
      recommendationId,
      actorId: ownerId,
      fromStatus: oldStatus,
      toStatus: RecommendationStatus.IN_PROGRESS,
      notes: 'Assigned owner',
      changes: { ownerId, dueDate },
    });

    return recommendation;
  }

  async updateStatus(
    recommendationId: string,
    status: RecommendationStatus,
    userId: string,
    notes?: string,
  ) {
    const recommendation = await this.recommendationRepo.findOne({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    const oldStatus = recommendation.status;
    recommendation.status = status;

    await this.recommendationRepo.save(recommendation);

    // Log activity
    await this.activityRepo.save({
      recommendationId,
      actorId: userId,
      fromStatus: oldStatus,
      toStatus: status,
      notes,
    });

    // Execute automation playbooks
    await this.executePlaybooks(recommendation, oldStatus, status);

    return recommendation;
  }

  async setPriority(recommendationId: string, priority: RecommendationPriority) {
    await this.recommendationRepo.update(recommendationId, { priority });
    return this.recommendationRepo.findOne({ where: { id: recommendationId } });
  }

  async getActivities(recommendationId: string) {
    return this.activityRepo.find({
      where: { recommendationId },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }

  async getWorkflowAnalytics(workspaceId: string = 'default') {
    const total = await this.recommendationRepo.count();
    const completed = await this.recommendationRepo.count({
      where: { status: RecommendationStatus.DONE },
    });
    const inProgress = await this.recommendationRepo.count({
      where: { status: RecommendationStatus.IN_PROGRESS },
    });

    return {
      total,
      completed,
      inProgress,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  private async executePlaybooks(
    recommendation: Recommendation,
    fromStatus: RecommendationStatus,
    toStatus: RecommendationStatus,
  ) {
    const playbooks = await this.playbookRepo.find({
      where: { enabled: true },
      order: { priority: 'DESC' },
    });

    for (const playbook of playbooks) {
      const { trigger, conditions } = playbook;

      // Check if playbook should execute
      if (trigger === 'STATUS_CHANGE') {
        const matchesConditions =
          (!conditions.recommendationType ||
            conditions.recommendationType === recommendation.type) &&
          (!conditions.toStatus || conditions.toStatus === toStatus);

        if (matchesConditions) {
          // Execute playbook actions
          for (const action of playbook.actions) {
            if (action === 'CREATE_TASK') {
              await this.createFollowUpTask(recommendation, playbook.actionConfig);
            }
          }
        }
      }
    }
  }

  private async createFollowUpTask(
    recommendation: Recommendation,
    config: any,
  ) {
    const task = this.taskRepo.create({
      type: config.taskType || 'MANUAL_ACTION',
      title: config.title || `Follow-up for ${recommendation.title}`,
      description: config.description,
      relatedRecommendationId: recommendation.id,
      ownerId: config.ownerId || recommendation.ownerId,
      status: TaskStatus.TODO,
    });

    return this.taskRepo.save(task);
  }

  async getTasks(filters?: { status?: TaskStatus; ownerId?: string }) {
    const query = this.taskRepo.createQueryBuilder('task');

    if (filters?.status) {
      query.where('task.status = :status', { status: filters.status });
    }
    if (filters?.ownerId) {
      query.andWhere('task.ownerId = :ownerId', { ownerId: filters.ownerId });
    }

    return query.orderBy('task.createdAt', 'DESC').getMany();
  }

  async updateTask(taskId: string, updates: Partial<Task>) {
    await this.taskRepo.update(taskId, updates);
    return this.taskRepo.findOne({ where: { id: taskId } });
  }
}
