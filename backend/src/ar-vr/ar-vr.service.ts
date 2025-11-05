import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ARVRExperience } from '../database/entities/ar-vr-experience.entity';

@Injectable()
export class ARVRExperienceService {
  constructor(
    @InjectRepository(ARVRExperience)
    private repository: Repository<ARVRExperience>,
  ) {}

  async create(workspaceId: string, data: Partial<ARVRExperience>): Promise<ARVRExperience> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<ARVRExperience[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<ARVRExperience> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<ARVRExperience>): Promise<ARVRExperience> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
