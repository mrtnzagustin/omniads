import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetailMediaNetworkHub } from './retail-media-network-hub.entity';

@Injectable()
export class RetailMediaNetworkHubService {
  private readonly logger = new Logger(RetailMediaNetworkHubService.name);

  constructor(
    @InjectRepository(RetailMediaNetworkHub)
    private repository: Repository<RetailMediaNetworkHub>,
  ) {}

  async findAll(): Promise<RetailMediaNetworkHub[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<RetailMediaNetworkHub | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<RetailMediaNetworkHub>): Promise<RetailMediaNetworkHub> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<RetailMediaNetworkHub>): Promise<RetailMediaNetworkHub> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`RetailMediaNetworkHub ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing RetailMediaNetworkHub ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`RetailMediaNetworkHub ${id} not found`);
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
