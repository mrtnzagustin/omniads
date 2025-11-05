import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EconomicTrendAnalysisEntity } from '../database/entities/economic-trend-analysis-main.entity';

@Injectable()
export class EconomicTrendAnalysisService {
  constructor(
    @InjectRepository(EconomicTrendAnalysisEntity)
    private repository: Repository<EconomicTrendAnalysisEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<EconomicTrendAnalysisEntity>): Promise<EconomicTrendAnalysisEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<EconomicTrendAnalysisEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<EconomicTrendAnalysisEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<EconomicTrendAnalysisEntity>): Promise<EconomicTrendAnalysisEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
