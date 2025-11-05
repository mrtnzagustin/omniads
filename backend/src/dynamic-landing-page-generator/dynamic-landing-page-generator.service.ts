import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicLandingPageGenerator } from './dynamic-landing-page-generator.entity';

@Injectable()
export class DynamicLandingPageGeneratorService {
  private readonly logger = new Logger(DynamicLandingPageGeneratorService.name);

  constructor(
    @InjectRepository(DynamicLandingPageGenerator)
    private repository: Repository<DynamicLandingPageGenerator>,
  ) {}

  async findAll(): Promise<DynamicLandingPageGenerator[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<DynamicLandingPageGenerator | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<DynamicLandingPageGenerator>): Promise<DynamicLandingPageGenerator> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<DynamicLandingPageGenerator>): Promise<DynamicLandingPageGenerator> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`DynamicLandingPageGenerator ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing DynamicLandingPageGenerator ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`DynamicLandingPageGenerator ${id} not found`);
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
