import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdCopyTemplate } from '../database/entities/ad-copy-template.entity';

@Injectable()
export class AdCopyGeneratorService {
  constructor(
    @InjectRepository(AdCopyTemplate)
    private templateRepository: Repository<AdCopyTemplate>,
  ) {}

  async generateAdCopy(workspaceId: string, inputs: Record<string, string>): Promise<string[]> {
    const templates = await this.templateRepository.find({
      where: { workspaceId, isActive: true },
    });

    const generated = templates.map(template => {
      let copy = template.template;
      template.variables?.forEach(variable => {
        copy = copy.replace(`{${variable}}`, inputs[variable] || variable);
      });
      return copy;
    });

    return generated;
  }

  async createTemplate(dto: any): Promise<AdCopyTemplate> {
    return this.templateRepository.save(this.templateRepository.create(dto));
  }

  async listTemplates(workspaceId: string): Promise<AdCopyTemplate[]> {
    return this.templateRepository.find({
      where: { workspaceId },
      order: { averagePerformanceScore: 'DESC' },
    });
  }
}
