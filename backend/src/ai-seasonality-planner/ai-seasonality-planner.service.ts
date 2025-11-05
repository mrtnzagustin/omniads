import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiSeasonalityPlanner } from '../database/entities/ai-seasonality-planner.entity';

export interface CreateAiSeasonalityPlannerDto {
  userId: string;
  name: string;
  description: string;
  configuration: {
    enabled: boolean;
    settings: Record<string, any>;
  };
}

@Injectable()
export class AiSeasonalityPlannerService {
  constructor(
    @InjectRepository(AiSeasonalityPlanner)
    private repository: Repository<AiSeasonalityPlanner>,
  ) {}

  async create(dto: CreateAiSeasonalityPlannerDto): Promise<AiSeasonalityPlanner> {
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

  async findAllByUser(userId: string): Promise<AiSeasonalityPlanner[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<AiSeasonalityPlanner | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('AI seasonality planner not found');
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

  async update(id: string, updates: Partial<AiSeasonalityPlanner>): Promise<AiSeasonalityPlanner> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('AI seasonality planner not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
