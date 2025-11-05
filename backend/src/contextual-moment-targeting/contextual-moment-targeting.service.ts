import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContextualMomentTargeting } from '../database/entities/contextual-moment-targeting.entity';

export interface CreateContextualMomentTargetingDto {
  userId: string;
  name: string;
  description: string;
  configuration: {
    momentTypes: string[];
    contextualSignals: {
      signal: string;
      weight: number;
      threshold: number;
    }[];
    timeWindows: {
      dayOfWeek: string[];
      hourRange: { start: number; end: number };
    };
    locationContext: {
      enabled: boolean;
      geofences: string[];
    };
    behaviorTriggers: {
      action: string;
      timing: string;
      priority: number;
    }[];
  };
}

@Injectable()
export class ContextualMomentTargetingService {
  constructor(
    @InjectRepository(ContextualMomentTargeting)
    private repository: Repository<ContextualMomentTargeting>,
  ) {}

  async create(dto: CreateContextualMomentTargetingDto): Promise<ContextualMomentTargeting> {
    const entity = this.repository.create({
      ...dto,
      status: 'active',
      metrics: {
        totalMoments: 0,
        momentsCaptured: 0,
        captureRate: 0,
        avgEngagementRate: 0,
        conversionRate: 0,
        topMoments: []
      }
    });

    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<ContextualMomentTargeting[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<ContextualMomentTargeting | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Contextual moment targeting not found');
    }

    // Simulate analysis
    const analysis = {
      id: entity.id,
      name: entity.name,
      momentAnalysis: {
        totalMomentTypes: entity.configuration.momentTypes.length,
        activeSignals: entity.configuration.contextualSignals.length,
        behaviorTriggers: entity.configuration.behaviorTriggers.length,
        timeWindowCoverage: this.calculateTimeWindowCoverage(entity.configuration.timeWindows)
      },
      performance: entity.metrics,
      recommendations: this.generateRecommendations(entity)
    };

    return analysis;
  }

  private calculateTimeWindowCoverage(timeWindows: any): number {
    const daysActive = timeWindows.dayOfWeek.length;
    const hoursCovered = timeWindows.hourRange.end - timeWindows.hourRange.start;
    return (daysActive / 7) * (hoursCovered / 24) * 100;
  }

  private generateRecommendations(entity: ContextualMomentTargeting): string[] {
    const recommendations = [];

    if (entity.configuration.momentTypes.length < 3) {
      recommendations.push('Consider adding more moment types to capture diverse user contexts');
    }

    if (entity.configuration.contextualSignals.length < 5) {
      recommendations.push('Add more contextual signals to improve targeting accuracy');
    }

    if (!entity.configuration.locationContext.enabled) {
      recommendations.push('Enable location context for better moment detection');
    }

    if (entity.metrics && entity.metrics.captureRate < 50) {
      recommendations.push('Adjust signal thresholds to improve moment capture rate');
    }

    return recommendations;
  }

  async update(id: string, updates: Partial<ContextualMomentTargeting>): Promise<ContextualMomentTargeting> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Contextual moment targeting not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
