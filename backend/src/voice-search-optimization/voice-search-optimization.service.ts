import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoiceSearchOptimizationEntity } from '../database/entities/voice-search-optimization-main.entity';

@Injectable()
export class VoiceSearchOptimizationService {
  constructor(
    @InjectRepository(VoiceSearchOptimizationEntity)
    private repository: Repository<VoiceSearchOptimizationEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<VoiceSearchOptimizationEntity>): Promise<VoiceSearchOptimizationEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<VoiceSearchOptimizationEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<VoiceSearchOptimizationEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<VoiceSearchOptimizationEntity>): Promise<VoiceSearchOptimizationEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
