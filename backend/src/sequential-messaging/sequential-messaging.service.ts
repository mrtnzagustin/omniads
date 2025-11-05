import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SequentialMessageConfig } from '../database/entities/sequential-message-config.entity';

@Injectable()
export class SequentialMessageConfigService {
  constructor(
    @InjectRepository(SequentialMessageConfig)
    private repository: Repository<SequentialMessageConfig>,
  ) {}

  async create(workspaceId: string, data: Partial<SequentialMessageConfig>): Promise<SequentialMessageConfig> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<SequentialMessageConfig[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<SequentialMessageConfig> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<SequentialMessageConfig>): Promise<SequentialMessageConfig> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
