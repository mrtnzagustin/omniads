import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionRetentionEntity } from '../database/entities/subscription-retention-main.entity';

@Injectable()
export class SubscriptionRetentionService {
  constructor(
    @InjectRepository(SubscriptionRetentionEntity)
    private repository: Repository<SubscriptionRetentionEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<SubscriptionRetentionEntity>): Promise<SubscriptionRetentionEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<SubscriptionRetentionEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<SubscriptionRetentionEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<SubscriptionRetentionEntity>): Promise<SubscriptionRetentionEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
