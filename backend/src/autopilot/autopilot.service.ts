import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutopilotConfig } from '../database/entities/autopilot-config.entity';

@Injectable()
export class AutopilotConfigService {
  constructor(
    @InjectRepository(AutopilotConfig)
    private repository: Repository<AutopilotConfig>,
  ) {}

  async create(workspaceId: string, data: Partial<AutopilotConfig>): Promise<AutopilotConfig> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<AutopilotConfig[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<AutopilotConfig> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<AutopilotConfig>): Promise<AutopilotConfig> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
