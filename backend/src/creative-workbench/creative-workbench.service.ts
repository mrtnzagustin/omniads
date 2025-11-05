import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreativeAsset, AssetType, FunnelStage } from '../database/entities/creative-asset.entity';
import { CreativeMetricSnapshot } from '../database/entities/creative-metric-snapshot.entity';
import { CreativeCollection } from '../database/entities/creative-collection.entity';
import { CreativeCollectionItem } from '../database/entities/creative-collection-item.entity';

@Injectable()
export class CreativeWorkbenchService {
  constructor(
    @InjectRepository(CreativeAsset)
    private creativeRepo: Repository<CreativeAsset>,
    @InjectRepository(CreativeMetricSnapshot)
    private snapshotRepo: Repository<CreativeMetricSnapshot>,
    @InjectRepository(CreativeCollection)
    private collectionRepo: Repository<CreativeCollection>,
    @InjectRepository(CreativeCollectionItem)
    private collectionItemRepo: Repository<CreativeCollectionItem>,
  ) {}

  async getCreatives(filters?: {
    platform?: string;
    assetType?: AssetType;
    funnelStage?: FunnelStage;
  }) {
    const query = this.creativeRepo
      .createQueryBuilder('creative')
      .leftJoinAndSelect('creative.campaign', 'campaign')
      .where('creative.active = :active', { active: true });

    if (filters?.platform) {
      query.andWhere('creative.platform = :platform', { platform: filters.platform });
    }
    if (filters?.assetType) {
      query.andWhere('creative.assetType = :assetType', { assetType: filters.assetType });
    }
    if (filters?.funnelStage) {
      query.andWhere('creative.funnelStage = :funnelStage', { funnelStage: filters.funnelStage });
    }

    return query.orderBy('creative.createdAt', 'DESC').getMany();
  }

  async getCreativeById(id: string) {
    return this.creativeRepo.findOne({
      where: { id },
      relations: ['campaign'],
    });
  }

  async getCreativeMetrics(creativeId: string) {
    return this.snapshotRepo.find({
      where: { creativeId },
      order: { periodStart: 'DESC' },
      take: 30,
    });
  }

  async getCollections(ownerId?: string) {
    const query = this.collectionRepo.createQueryBuilder('collection');

    if (ownerId) {
      query.where('collection.ownerId = :ownerId', { ownerId });
    }

    return query.orderBy('collection.createdAt', 'DESC').getMany();
  }

  async createCollection(data: {
    name: string;
    hypothesis?: string;
    goalMetric?: string;
    ownerId?: string;
  }) {
    const collection = this.collectionRepo.create(data);
    return this.collectionRepo.save(collection);
  }

  async addCreativeToCollection(collectionId: string, creativeId: string, role?: string) {
    const item = this.collectionItemRepo.create({
      collectionId,
      creativeId,
      role: role as any,
    });
    return this.collectionItemRepo.save(item);
  }

  async getCollectionItems(collectionId: string) {
    return this.collectionItemRepo.find({
      where: { collectionId },
      relations: ['creative'],
    });
  }
}
