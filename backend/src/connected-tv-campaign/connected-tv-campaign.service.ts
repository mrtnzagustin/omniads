import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectedTVCampaignEntity } from '../database/entities/connected-tv-campaign-main.entity';

@Injectable()
export class ConnectedTVCampaignService {
  constructor(
    @InjectRepository(ConnectedTVCampaignEntity)
    private repository: Repository<ConnectedTVCampaignEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<ConnectedTVCampaignEntity>): Promise<ConnectedTVCampaignEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<ConnectedTVCampaignEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<ConnectedTVCampaignEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<ConnectedTVCampaignEntity>): Promise<ConnectedTVCampaignEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
