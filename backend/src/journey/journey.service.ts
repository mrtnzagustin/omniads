import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JourneyConfig } from '../database/entities/journey-config.entity';

@Injectable()
export class JourneyConfigService {
  constructor(
    @InjectRepository(JourneyConfig)
    private repository: Repository<JourneyConfig>,
  ) {}

  async create(workspaceId: string, data: Partial<JourneyConfig>): Promise<JourneyConfig> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<JourneyConfig[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<JourneyConfig> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<JourneyConfig>): Promise<JourneyConfig> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
