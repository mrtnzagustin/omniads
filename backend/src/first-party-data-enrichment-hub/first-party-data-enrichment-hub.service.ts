import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FirstPartyDataEnrichmentHub } from './first-party-data-enrichment-hub.entity';

@Injectable()
export class FirstPartyDataEnrichmentHubService {
  private readonly logger = new Logger(FirstPartyDataEnrichmentHubService.name);

  constructor(
    @InjectRepository(FirstPartyDataEnrichmentHub)
    private repository: Repository<FirstPartyDataEnrichmentHub>,
  ) {}

  async findAll(): Promise<FirstPartyDataEnrichmentHub[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<FirstPartyDataEnrichmentHub | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<FirstPartyDataEnrichmentHub>): Promise<FirstPartyDataEnrichmentHub> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<FirstPartyDataEnrichmentHub>): Promise<FirstPartyDataEnrichmentHub> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`FirstPartyDataEnrichmentHub ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing FirstPartyDataEnrichmentHub ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`FirstPartyDataEnrichmentHub ${id} not found`);
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
