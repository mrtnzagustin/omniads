import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SustainabilityCarbonEntity } from '../database/entities/sustainability-carbon-main.entity';

@Injectable()
export class SustainabilityCarbonService {
  constructor(
    @InjectRepository(SustainabilityCarbonEntity)
    private repository: Repository<SustainabilityCarbonEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<SustainabilityCarbonEntity>): Promise<SustainabilityCarbonEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<SustainabilityCarbonEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<SustainabilityCarbonEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<SustainabilityCarbonEntity>): Promise<SustainabilityCarbonEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
