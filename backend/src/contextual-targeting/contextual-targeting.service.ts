import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContextualTargetingConfig } from '../database/entities/contextual-targeting-config.entity';

@Injectable()
export class ContextualTargetingConfigService {
  constructor(
    @InjectRepository(ContextualTargetingConfig)
    private repository: Repository<ContextualTargetingConfig>,
  ) {}

  async create(workspaceId: string, data: Partial<ContextualTargetingConfig>): Promise<ContextualTargetingConfig> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<ContextualTargetingConfig[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<ContextualTargetingConfig> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<ContextualTargetingConfig>): Promise<ContextualTargetingConfig> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
