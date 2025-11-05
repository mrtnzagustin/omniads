import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoAsset } from '../database/entities/video-asset.entity';

@Injectable()
export class VideoAssetService {
  constructor(
    @InjectRepository(VideoAsset)
    private repository: Repository<VideoAsset>,
  ) {}

  async create(workspaceId: string, data: Partial<VideoAsset>): Promise<VideoAsset> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<VideoAsset[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<VideoAsset> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<VideoAsset>): Promise<VideoAsset> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
