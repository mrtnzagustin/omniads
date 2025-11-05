import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompetitiveAdIntelligenceCloner } from './competitive-ad-intelligence-cloner.entity';

@Injectable()
export class CompetitiveAdIntelligenceClonerService {
  private readonly logger = new Logger(CompetitiveAdIntelligenceClonerService.name);

  constructor(
    @InjectRepository(CompetitiveAdIntelligenceCloner)
    private repository: Repository<CompetitiveAdIntelligenceCloner>,
  ) {}

  async findAll(): Promise<CompetitiveAdIntelligenceCloner[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<CompetitiveAdIntelligenceCloner | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<CompetitiveAdIntelligenceCloner>): Promise<CompetitiveAdIntelligenceCloner> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<CompetitiveAdIntelligenceCloner>): Promise<CompetitiveAdIntelligenceCloner> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`CompetitiveAdIntelligenceCloner ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing CompetitiveAdIntelligenceCloner ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`CompetitiveAdIntelligenceCloner ${id} not found`);
    }
    // Feature-specific processing logic
    const results = {
      processed: true,
      timestamp: new Date(),
      data: entity.config,
    };
    await this.update(id, { results });
    return results;
  }
}
