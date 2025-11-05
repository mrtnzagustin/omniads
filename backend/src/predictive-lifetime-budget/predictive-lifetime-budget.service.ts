import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PredictiveLifetimeBudget } from '../database/entities/predictive-lifetime-budget.entity';

export interface CreatePredictiveLifetimeBudgetDto {
  userId: string;
  name: string;
  description: string;
  configuration: {
    enabled: boolean;
    settings: Record<string, any>;
  };
}

@Injectable()
export class PredictiveLifetimeBudgetService {
  constructor(
    @InjectRepository(PredictiveLifetimeBudget)
    private repository: Repository<PredictiveLifetimeBudget>,
  ) {}

  async create(dto: CreatePredictiveLifetimeBudgetDto): Promise<PredictiveLifetimeBudget> {
    const entity = this.repository.create({
      ...dto,
      status: 'active',
      metrics: {
        totalProcessed: 0,
        successRate: 0,
        lastRun: new Date()
      }
    });

    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<PredictiveLifetimeBudget[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<PredictiveLifetimeBudget | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Predictive lifetime budget manager not found');
    }

    return {
      id: entity.id,
      name: entity.name,
      analysis: {
        status: entity.status,
        metrics: entity.metrics
      },
      recommendations: ['Configure settings for optimal performance']
    };
  }

  async update(id: string, updates: Partial<PredictiveLifetimeBudget>): Promise<PredictiveLifetimeBudget> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Predictive lifetime budget manager not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
