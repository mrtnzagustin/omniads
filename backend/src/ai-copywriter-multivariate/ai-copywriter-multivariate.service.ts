import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AICopywriterMultivariate } from './ai-copywriter-multivariate.entity';

@Injectable()
export class AICopywriterMultivariateService {
  private readonly logger = new Logger(AICopywriterMultivariateService.name);

  constructor(
    @InjectRepository(AICopywriterMultivariate)
    private repository: Repository<AICopywriterMultivariate>,
  ) {}

  async findAll(): Promise<AICopywriterMultivariate[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<AICopywriterMultivariate | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<AICopywriterMultivariate>): Promise<AICopywriterMultivariate> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<AICopywriterMultivariate>): Promise<AICopywriterMultivariate> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`AICopywriterMultivariate ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing AICopywriterMultivariate ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`AICopywriterMultivariate ${id} not found`);
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
