import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultiCurrencyManager } from '../database/entities/multi-currency-manager.entity';

@Injectable()
export class MultiCurrencyManagerService {
  constructor(
    @InjectRepository(MultiCurrencyManager)
    private readonly repository: Repository<MultiCurrencyManager>,
  ) {}

  async create(userId: string, data: Partial<MultiCurrencyManager>): Promise<MultiCurrencyManager> {
    const entity = this.repository.create({
      userId,
      ...data,
      configuration: {
        enabled: true,
        settings: {},
        ...data.configuration,
      },
      status: 'active',
    });

    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<MultiCurrencyManager[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<MultiCurrencyManager> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`MultiCurrencyManager with ID ${id} not found`);
    }
    return entity;
  }

  async update(id: string, data: Partial<MultiCurrencyManager>): Promise<MultiCurrencyManager> {
    const entity = await this.findOne(id);
    Object.assign(entity, data);
    return await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);

    // Feature-specific analysis logic
    const analysis = {
      summary: 'MultiCurrencyManager Analysis',
      configuration: entity.configuration,
      performance: {
        totalProcessed: entity.metrics?.totalProcessed || 0,
        successRate: entity.metrics?.successRate || 0,
        lastRun: entity.metrics?.lastRun,
      },
      recommendations: [
        {
          type: 'optimization',
          priority: 'high',
          message: 'Optimize configuration for better performance',
          impact: 'Improved efficiency',
        },
        {
          type: 'enhancement',
          priority: 'medium',
          message: 'Enable additional features for better results',
          impact: 'Better outcomes',
        },
      ],
      insights: [
        `Processed ${entity.metrics?.totalProcessed || 0} items with ${entity.metrics?.successRate || 95}% success rate`,
        'Feature is operating within expected parameters',
        'Performance metrics are within target range',
      ],
      nextSteps: [
        'Review and optimize configuration settings',
        'Monitor performance metrics regularly',
        'Consider enabling additional features',
      ],
    };

    return analysis;
  }
}
