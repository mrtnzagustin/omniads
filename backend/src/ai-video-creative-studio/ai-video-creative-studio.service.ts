import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIVideoCreativeStudioEntity } from '../database/entities/ai-video-creative-studio-main.entity';

@Injectable()
export class AIVideoCreativeStudioService {
  constructor(
    @InjectRepository(AIVideoCreativeStudioEntity)
    private repository: Repository<AIVideoCreativeStudioEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<AIVideoCreativeStudioEntity>): Promise<AIVideoCreativeStudioEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<AIVideoCreativeStudioEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<AIVideoCreativeStudioEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<AIVideoCreativeStudioEntity>): Promise<AIVideoCreativeStudioEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
