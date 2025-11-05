import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeSentimentOptimizer } from '../database/entities/realtime-sentiment-optimizer.entity';

export interface CreateRealtimeSentimentOptimizerDto {
  userId: string;
  name: string;
  description: string;
  configuration: {
    enabled: boolean;
    settings: Record<string, any>;
  };
}

@Injectable()
export class RealtimeSentimentOptimizerService {
  constructor(
    @InjectRepository(RealtimeSentimentOptimizer)
    private repository: Repository<RealtimeSentimentOptimizer>,
  ) {}

  async create(dto: CreateRealtimeSentimentOptimizerDto): Promise<RealtimeSentimentOptimizer> {
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

  async findAllByUser(userId: string): Promise<RealtimeSentimentOptimizer[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<RealtimeSentimentOptimizer | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Realtime sentiment optimizer not found');
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

  async update(id: string, updates: Partial<RealtimeSentimentOptimizer>): Promise<RealtimeSentimentOptimizer> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Realtime sentiment optimizer not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
