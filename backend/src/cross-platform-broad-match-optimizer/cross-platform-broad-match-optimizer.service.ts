import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossPlatformBroadMatchOptimizer } from './cross-platform-broad-match-optimizer.entity';

@Injectable()
export class CrossPlatformBroadMatchOptimizerService {
  private readonly logger = new Logger(CrossPlatformBroadMatchOptimizerService.name);

  constructor(
    @InjectRepository(CrossPlatformBroadMatchOptimizer)
    private repository: Repository<CrossPlatformBroadMatchOptimizer>,
  ) {}

  async findAll(): Promise<CrossPlatformBroadMatchOptimizer[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<CrossPlatformBroadMatchOptimizer | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<CrossPlatformBroadMatchOptimizer>): Promise<CrossPlatformBroadMatchOptimizer> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<CrossPlatformBroadMatchOptimizer>): Promise<CrossPlatformBroadMatchOptimizer> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`CrossPlatformBroadMatchOptimizer ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing CrossPlatformBroadMatchOptimizer ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`CrossPlatformBroadMatchOptimizer ${id} not found`);
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
