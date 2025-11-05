import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BudgetRecommendation,
  BudgetRecommendationStatus,
  Platform,
} from '../database/entities/budget-recommendation.entity';
import {
  BudgetAdjustment,
  BudgetAdjustmentStatus,
} from '../database/entities/budget-adjustment.entity';
import {
  AutomationRule,
  AutomationRuleType,
} from '../database/entities/automation-rule.entity';

@Injectable()
export class BudgetRebalancerService {
  constructor(
    @InjectRepository(BudgetRecommendation)
    private budgetRecommendationRepo: Repository<BudgetRecommendation>,
    @InjectRepository(BudgetAdjustment)
    private budgetAdjustmentRepo: Repository<BudgetAdjustment>,
    @InjectRepository(AutomationRule)
    private automationRuleRepo: Repository<AutomationRule>,
  ) {}

  async getRecommendations(status?: BudgetRecommendationStatus) {
    const query = this.budgetRecommendationRepo
      .createQueryBuilder('rec')
      .leftJoinAndSelect('rec.campaign', 'campaign')
      .orderBy('rec.createdAt', 'DESC');

    if (status) {
      query.where('rec.status = :status', { status });
    }

    return query.getMany();
  }

  async approveRecommendation(
    recommendationId: string,
    userId: string,
    actualDelta?: number,
  ) {
    const recommendation = await this.budgetRecommendationRepo.findOne({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    recommendation.status = BudgetRecommendationStatus.APPROVED;
    await this.budgetRecommendationRepo.save(recommendation);

    const adjustment = this.budgetAdjustmentRepo.create({
      recommendationId,
      approvedBy: userId,
      autoApproved: false,
      status: BudgetAdjustmentStatus.APPROVED,
      actualDelta: actualDelta || recommendation.suggestedDelta,
    });

    return this.budgetAdjustmentRepo.save(adjustment);
  }

  async rejectRecommendation(recommendationId: string) {
    const recommendation = await this.budgetRecommendationRepo.findOne({
      where: { id: recommendationId },
    });

    if (!recommendation) {
      throw new Error('Recommendation not found');
    }

    recommendation.status = BudgetRecommendationStatus.REJECTED;
    return this.budgetRecommendationRepo.save(recommendation);
  }

  async getAdjustments() {
    return this.budgetAdjustmentRepo.find({
      relations: ['recommendation', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async dispatchAdjustment(adjustmentId: string) {
    const adjustment = await this.budgetAdjustmentRepo.findOne({
      where: { id: adjustmentId },
      relations: ['recommendation'],
    });

    if (!adjustment) {
      throw new Error('Adjustment not found');
    }

    // Mock dispatch to platform API
    adjustment.status = BudgetAdjustmentStatus.DISPATCHED;
    adjustment.dispatchedAt = new Date();
    adjustment.platformExecutionId = `mock_${Date.now()}`;

    // Simulate API execution
    setTimeout(async () => {
      adjustment.status = BudgetAdjustmentStatus.CONFIRMED;
      await this.budgetAdjustmentRepo.save(adjustment);
    }, 2000);

    return this.budgetAdjustmentRepo.save(adjustment);
  }

  async getAutomationRules(workspaceId: string) {
    return this.automationRuleRepo.find({
      where: { workspaceId },
      order: { priority: 'DESC' },
    });
  }

  async createAutomationRule(data: {
    workspaceId: string;
    name: string;
    description?: string;
    type: AutomationRuleType;
    conditions: any;
    actions?: any;
    platform?: Platform;
  }) {
    const rule = this.automationRuleRepo.create(data);
    return this.automationRuleRepo.save(rule);
  }

  async updateAutomationRule(id: string, data: Partial<AutomationRule>) {
    await this.automationRuleRepo.update(id, data);
    return this.automationRuleRepo.findOne({ where: { id } });
  }

  async evaluateAutomation(recommendation: BudgetRecommendation) {
    // Simplified auto-approval logic
    const rules = await this.automationRuleRepo.find({
      where: {
        workspaceId: 'default', // In real app, get from context
        type: AutomationRuleType.AUTO_APPROVE_BUDGET,
        enabled: true,
      },
      order: { priority: 'DESC' },
    });

    for (const rule of rules) {
      const conditions = rule.conditions;
      const percentageChange = Math.abs(
        Number(recommendation.suggestedDelta) /
          (recommendation.metadata?.currentBudget || 1000),
      );

      if (
        percentageChange <= conditions.maxPercentageChange / 100 &&
        recommendation.confidenceScore >= conditions.minRoas
      ) {
        // Auto-approve
        const adjustment = this.budgetAdjustmentRepo.create({
          recommendationId: recommendation.id,
          autoApproved: true,
          status: BudgetAdjustmentStatus.APPROVED,
          actualDelta: recommendation.suggestedDelta,
        });

        await this.budgetAdjustmentRepo.save(adjustment);
        recommendation.status = BudgetRecommendationStatus.APPROVED;
        await this.budgetRecommendationRepo.save(recommendation);

        return true;
      }
    }

    return false;
  }
}
