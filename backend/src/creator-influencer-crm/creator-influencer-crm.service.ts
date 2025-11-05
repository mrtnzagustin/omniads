import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorInfluencerCRMEntity } from '../database/entities/creator-influencer-crm-main.entity';

@Injectable()
export class CreatorInfluencerCRMService {
  constructor(
    @InjectRepository(CreatorInfluencerCRMEntity)
    private repository: Repository<CreatorInfluencerCRMEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<CreatorInfluencerCRMEntity>): Promise<CreatorInfluencerCRMEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<CreatorInfluencerCRMEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<CreatorInfluencerCRMEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<CreatorInfluencerCRMEntity>): Promise<CreatorInfluencerCRMEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
