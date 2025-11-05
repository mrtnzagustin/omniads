import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealtimeCompetitorBidMonitor } from './realtime-competitor-bid-monitor.entity';

@Injectable()
export class RealtimeCompetitorBidMonitorService {
  private readonly logger = new Logger(RealtimeCompetitorBidMonitorService.name);

  constructor(
    @InjectRepository(RealtimeCompetitorBidMonitor)
    private repository: Repository<RealtimeCompetitorBidMonitor>,
  ) {}

  async findAll(): Promise<RealtimeCompetitorBidMonitor[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<RealtimeCompetitorBidMonitor | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<RealtimeCompetitorBidMonitor>): Promise<RealtimeCompetitorBidMonitor> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<RealtimeCompetitorBidMonitor>): Promise<RealtimeCompetitorBidMonitor> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`RealtimeCompetitorBidMonitor ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing RealtimeCompetitorBidMonitor ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`RealtimeCompetitorBidMonitor ${id} not found`);
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
