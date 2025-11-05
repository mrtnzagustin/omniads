import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialListeningEntity } from '../database/entities/social-listening-main.entity';

@Injectable()
export class SocialListeningService {
  constructor(
    @InjectRepository(SocialListeningEntity)
    private repository: Repository<SocialListeningEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<SocialListeningEntity>): Promise<SocialListeningEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<SocialListeningEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<SocialListeningEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<SocialListeningEntity>): Promise<SocialListeningEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
