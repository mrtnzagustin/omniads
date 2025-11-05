import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfluencerPerformancePredictor } from './influencer-performance-predictor.entity';

@Injectable()
export class InfluencerPerformancePredictorService {
  private readonly logger = new Logger(InfluencerPerformancePredictorService.name);

  constructor(
    @InjectRepository(InfluencerPerformancePredictor)
    private repository: Repository<InfluencerPerformancePredictor>,
  ) {}

  async findAll(): Promise<InfluencerPerformancePredictor[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<InfluencerPerformancePredictor | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<InfluencerPerformancePredictor>): Promise<InfluencerPerformancePredictor> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<InfluencerPerformancePredictor>): Promise<InfluencerPerformancePredictor> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`InfluencerPerformancePredictor ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing InfluencerPerformancePredictor ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`InfluencerPerformancePredictor ${id} not found`);
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
