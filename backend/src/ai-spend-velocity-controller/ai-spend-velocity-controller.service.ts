import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiSpendVelocityController } from '../database/entities/ai-spend-velocity-controller.entity';

export interface CreateAiSpendVelocityControllerDto {
  userId: string;
  name: string;
  description: string;
  configuration: {
    targetSpendRate: number;
    timeframe: string;
    velocityThresholds: {
      slowdown: number;
      optimal: number;
      accelerate: number;
    };
    budgetConstraints: {
      minDailySpend: number;
      maxDailySpend: number;
      totalBudget: number;
    };
    performanceGates: {
      metric: string;
      threshold: number;
      action: string;
    }[];
    adjustmentRules: {
      condition: string;
      adjustment: number;
      cooldownPeriod: number;
    }[];
  };
}

@Injectable()
export class AiSpendVelocityControllerService {
  constructor(
    @InjectRepository(AiSpendVelocityController)
    private repository: Repository<AiSpendVelocityController>,
  ) {}

  async create(dto: CreateAiSpendVelocityControllerDto): Promise<AiSpendVelocityController> {
    const entity = this.repository.create({
      ...dto,
      status: 'active',
      metrics: {
        currentVelocity: 0,
        targetVelocity: dto.configuration.targetSpendRate,
        spendToDate: 0,
        projectedSpend: 0,
        adjustmentsCount: 0,
        performanceScore: 0,
        velocityHistory: []
      }
    });

    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<AiSpendVelocityController[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<AiSpendVelocityController | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('AI spend velocity controller not found');
    }

    const analysis = {
      id: entity.id,
      name: entity.name,
      velocityAnalysis: {
        currentVelocity: entity.metrics?.currentVelocity || 0,
        targetVelocity: entity.configuration.targetSpendRate,
        velocityStatus: this.determineVelocityStatus(entity),
        spendPacing: this.calculateSpendPacing(entity)
      },
      performance: entity.metrics,
      recommendations: this.generateRecommendations(entity)
    };

    return analysis;
  }

  private determineVelocityStatus(entity: AiSpendVelocityController): string {
    const current = entity.metrics?.currentVelocity || 0;
    const thresholds = entity.configuration.velocityThresholds;

    if (current < thresholds.slowdown) return 'slow';
    if (current > thresholds.accelerate) return 'fast';
    return 'optimal';
  }

  private calculateSpendPacing(entity: AiSpendVelocityController): number {
    const spendToDate = entity.metrics?.spendToDate || 0;
    const totalBudget = entity.configuration.budgetConstraints.totalBudget;
    return (spendToDate / totalBudget) * 100;
  }

  private generateRecommendations(entity: AiSpendVelocityController): string[] {
    const recommendations = [];
    const velocityStatus = this.determineVelocityStatus(entity);

    if (velocityStatus === 'slow') {
      recommendations.push('Consider increasing daily spend to meet pacing goals');
    } else if (velocityStatus === 'fast') {
      recommendations.push('Reduce spend velocity to avoid budget overrun');
    }

    if (entity.configuration.performanceGates.length === 0) {
      recommendations.push('Add performance gates to protect campaign efficiency');
    }

    if (entity.configuration.adjustmentRules.length === 0) {
      recommendations.push('Define adjustment rules for automated velocity control');
    }

    return recommendations;
  }

  async update(id: string, updates: Partial<AiSpendVelocityController>): Promise<AiSpendVelocityController> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('AI spend velocity controller not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
