import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SentimentDrivenBudgetAllocator } from './sentiment-driven-budget-allocator.entity';

@Injectable()
export class SentimentDrivenBudgetAllocatorService {
  private readonly logger = new Logger(SentimentDrivenBudgetAllocatorService.name);

  constructor(
    @InjectRepository(SentimentDrivenBudgetAllocator)
    private repository: Repository<SentimentDrivenBudgetAllocator>,
  ) {}

  async findAll(): Promise<SentimentDrivenBudgetAllocator[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<SentimentDrivenBudgetAllocator | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<SentimentDrivenBudgetAllocator>): Promise<SentimentDrivenBudgetAllocator> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<SentimentDrivenBudgetAllocator>): Promise<SentimentDrivenBudgetAllocator> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`SentimentDrivenBudgetAllocator ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing SentimentDrivenBudgetAllocator ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`SentimentDrivenBudgetAllocator ${id} not found`);
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
