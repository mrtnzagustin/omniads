import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepLearningAudienceEntity } from '../database/entities/deep-learning-audience-main.entity';

@Injectable()
export class DeepLearningAudienceService {
  constructor(
    @InjectRepository(DeepLearningAudienceEntity)
    private repository: Repository<DeepLearningAudienceEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<DeepLearningAudienceEntity>): Promise<DeepLearningAudienceEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<DeepLearningAudienceEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<DeepLearningAudienceEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<DeepLearningAudienceEntity>): Promise<DeepLearningAudienceEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
