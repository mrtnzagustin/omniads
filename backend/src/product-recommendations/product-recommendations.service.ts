import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationModel } from '../database/entities/recommendation-model.entity';

@Injectable()
export class RecommendationModelService {
  constructor(
    @InjectRepository(RecommendationModel)
    private repository: Repository<RecommendationModel>,
  ) {}

  async create(workspaceId: string, data: Partial<RecommendationModel>): Promise<RecommendationModel> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<RecommendationModel[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<RecommendationModel> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<RecommendationModel>): Promise<RecommendationModel> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
