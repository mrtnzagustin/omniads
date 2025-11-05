import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerLifecycleJourneyMapper } from './customer-lifecycle-journey-mapper.entity';

@Injectable()
export class CustomerLifecycleJourneyMapperService {
  private readonly logger = new Logger(CustomerLifecycleJourneyMapperService.name);

  constructor(
    @InjectRepository(CustomerLifecycleJourneyMapper)
    private repository: Repository<CustomerLifecycleJourneyMapper>,
  ) {}

  async findAll(): Promise<CustomerLifecycleJourneyMapper[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<CustomerLifecycleJourneyMapper | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<CustomerLifecycleJourneyMapper>): Promise<CustomerLifecycleJourneyMapper> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<CustomerLifecycleJourneyMapper>): Promise<CustomerLifecycleJourneyMapper> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`CustomerLifecycleJourneyMapper ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing CustomerLifecycleJourneyMapper ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`CustomerLifecycleJourneyMapper ${id} not found`);
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
