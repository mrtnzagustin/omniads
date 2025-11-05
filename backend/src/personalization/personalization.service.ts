import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalizationRule } from '../database/entities/personalization-rule.entity';

@Injectable()
export class PersonalizationRuleService {
  constructor(
    @InjectRepository(PersonalizationRule)
    private repository: Repository<PersonalizationRule>,
  ) {}

  async create(workspaceId: string, data: Partial<PersonalizationRule>): Promise<PersonalizationRule> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<PersonalizationRule[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<PersonalizationRule> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<PersonalizationRule>): Promise<PersonalizationRule> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
