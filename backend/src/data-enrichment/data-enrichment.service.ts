import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataEnrichmentConfig } from '../database/entities/data-enrichment-config.entity';

@Injectable()
export class DataEnrichmentConfigService {
  constructor(
    @InjectRepository(DataEnrichmentConfig)
    private repository: Repository<DataEnrichmentConfig>,
  ) {}

  async create(workspaceId: string, data: Partial<DataEnrichmentConfig>): Promise<DataEnrichmentConfig> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<DataEnrichmentConfig[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<DataEnrichmentConfig> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<DataEnrichmentConfig>): Promise<DataEnrichmentConfig> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
