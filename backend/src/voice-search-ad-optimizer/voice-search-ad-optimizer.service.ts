import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoiceSearchAdOptimizer } from './voice-search-ad-optimizer.entity';

@Injectable()
export class VoiceSearchAdOptimizerService {
  private readonly logger = new Logger(VoiceSearchAdOptimizerService.name);

  constructor(
    @InjectRepository(VoiceSearchAdOptimizer)
    private repository: Repository<VoiceSearchAdOptimizer>,
  ) {}

  async findAll(): Promise<VoiceSearchAdOptimizer[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<VoiceSearchAdOptimizer | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<VoiceSearchAdOptimizer>): Promise<VoiceSearchAdOptimizer> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<VoiceSearchAdOptimizer>): Promise<VoiceSearchAdOptimizer> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`VoiceSearchAdOptimizer ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing VoiceSearchAdOptimizer ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`VoiceSearchAdOptimizer ${id} not found`);
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
