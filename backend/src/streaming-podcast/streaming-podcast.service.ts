import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamingPodcastAdEntity } from '../database/entities/streaming-podcast-main.entity';

@Injectable()
export class StreamingPodcastAdService {
  constructor(
    @InjectRepository(StreamingPodcastAdEntity)
    private repository: Repository<StreamingPodcastAdEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<StreamingPodcastAdEntity>): Promise<StreamingPodcastAdEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<StreamingPodcastAdEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<StreamingPodcastAdEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<StreamingPodcastAdEntity>): Promise<StreamingPodcastAdEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
