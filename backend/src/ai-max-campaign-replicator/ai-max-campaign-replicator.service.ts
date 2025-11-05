import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIMaxCampaignReplicator } from './ai-max-campaign-replicator.entity';

@Injectable()
export class AIMaxCampaignReplicatorService {
  private readonly logger = new Logger(AIMaxCampaignReplicatorService.name);

  constructor(
    @InjectRepository(AIMaxCampaignReplicator)
    private repository: Repository<AIMaxCampaignReplicator>,
  ) {}

  async findAll(): Promise<AIMaxCampaignReplicator[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<AIMaxCampaignReplicator | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<AIMaxCampaignReplicator>): Promise<AIMaxCampaignReplicator> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<AIMaxCampaignReplicator>): Promise<AIMaxCampaignReplicator> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`AIMaxCampaignReplicator ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing AIMaxCampaignReplicator ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`AIMaxCampaignReplicator ${id} not found`);
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
