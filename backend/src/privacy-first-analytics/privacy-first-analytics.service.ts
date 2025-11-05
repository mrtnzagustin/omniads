import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivacyFirstAnalyticsEntity } from '../database/entities/privacy-first-analytics-main.entity';

@Injectable()
export class PrivacyFirstAnalyticsService {
  constructor(
    @InjectRepository(PrivacyFirstAnalyticsEntity)
    private repository: Repository<PrivacyFirstAnalyticsEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<PrivacyFirstAnalyticsEntity>): Promise<PrivacyFirstAnalyticsEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<PrivacyFirstAnalyticsEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<PrivacyFirstAnalyticsEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<PrivacyFirstAnalyticsEntity>): Promise<PrivacyFirstAnalyticsEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
