import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandingPageTemplate } from '../database/entities/landing-page-template.entity';

@Injectable()
export class LandingPageTemplateService {
  constructor(
    @InjectRepository(LandingPageTemplate)
    private repository: Repository<LandingPageTemplate>,
  ) {}

  async create(workspaceId: string, data: Partial<LandingPageTemplate>): Promise<LandingPageTemplate> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<LandingPageTemplate[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<LandingPageTemplate> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<LandingPageTemplate>): Promise<LandingPageTemplate> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
