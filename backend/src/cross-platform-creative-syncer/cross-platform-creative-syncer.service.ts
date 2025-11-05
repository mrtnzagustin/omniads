import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossPlatformCreativeSyncer } from '../database/entities/cross-platform-creative-syncer.entity';

export interface CreateCrossPlatformCreativeSyncerDto {
  userId: string;
  name: string;
  description: string;
  configuration: {
    platforms: string[];
    creativeAssets: {
      assetId: string;
      assetType: string;
      originalPlatform: string;
      adaptations: {
        platform: string;
        format: string;
        dimensions: string;
        status: string;
      }[];
    }[];
    syncSettings: {
      autoSync: boolean;
      syncFrequency: string;
      conflictResolution: string;
    };
    transformationRules: {
      rule: string;
      fromPlatform: string;
      toPlatform: string;
      adjustments: Record<string, any>;
    }[];
  };
}

@Injectable()
export class CrossPlatformCreativeSyncerService {
  constructor(
    @InjectRepository(CrossPlatformCreativeSyncer)
    private repository: Repository<CrossPlatformCreativeSyncer>,
  ) {}

  async create(dto: CreateCrossPlatformCreativeSyncerDto): Promise<CrossPlatformCreativeSyncer> {
    const entity = this.repository.create({
      ...dto,
      status: 'active',
      metrics: {
        totalAssets: dto.configuration.creativeAssets.length,
        syncedAssets: 0,
        pendingSync: dto.configuration.creativeAssets.length,
        failedSync: 0,
        platformCoverage: dto.configuration.platforms.map(p => ({
          platform: p,
          assetCount: 0,
          lastSync: new Date()
        })),
        syncHistory: []
      }
    });

    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<CrossPlatformCreativeSyncer[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<CrossPlatformCreativeSyncer | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Cross-platform creative syncer not found');
    }

    const analysis = {
      id: entity.id,
      name: entity.name,
      syncAnalysis: {
        totalPlatforms: entity.configuration.platforms.length,
        totalAssets: entity.configuration.creativeAssets.length,
        syncStatus: {
          synced: entity.metrics?.syncedAssets || 0,
          pending: entity.metrics?.pendingSync || 0,
          failed: entity.metrics?.failedSync || 0
        },
        platformDistribution: entity.metrics?.platformCoverage || []
      },
      performance: entity.metrics,
      recommendations: this.generateRecommendations(entity)
    };

    return analysis;
  }

  private generateRecommendations(entity: CrossPlatformCreativeSyncer): string[] {
    const recommendations = [];

    if (entity.configuration.platforms.length < 3) {
      recommendations.push('Consider adding more platforms to maximize creative asset reach');
    }

    if (!entity.configuration.syncSettings.autoSync) {
      recommendations.push('Enable auto-sync to ensure creative assets stay up-to-date across platforms');
    }

    if (entity.configuration.transformationRules.length === 0) {
      recommendations.push('Add transformation rules to optimize creative assets for each platform');
    }

    if (entity.metrics && entity.metrics.failedSync > 0) {
      recommendations.push('Review failed sync operations and update transformation rules');
    }

    return recommendations;
  }

  async update(id: string, updates: Partial<CrossPlatformCreativeSyncer>): Promise<CrossPlatformCreativeSyncer> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Cross-platform creative syncer not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
