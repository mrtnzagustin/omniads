import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfluencerProfile } from '../database/entities/influencer-profile.entity';

@Injectable()
export class InfluencerProfileService {
  constructor(
    @InjectRepository(InfluencerProfile)
    private repository: Repository<InfluencerProfile>,
  ) {}

  async create(workspaceId: string, data: Partial<InfluencerProfile>): Promise<InfluencerProfile> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<InfluencerProfile[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<InfluencerProfile> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<InfluencerProfile>): Promise<InfluencerProfile> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
