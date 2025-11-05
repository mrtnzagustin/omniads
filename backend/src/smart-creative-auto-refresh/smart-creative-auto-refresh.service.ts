import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmartCreativeAutoRefresh } from './smart-creative-auto-refresh.entity';

@Injectable()
export class SmartCreativeAutoRefreshService {
  private readonly logger = new Logger(SmartCreativeAutoRefreshService.name);

  constructor(
    @InjectRepository(SmartCreativeAutoRefresh)
    private repository: Repository<SmartCreativeAutoRefresh>,
  ) {}

  async findAll(): Promise<SmartCreativeAutoRefresh[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<SmartCreativeAutoRefresh | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<SmartCreativeAutoRefresh>): Promise<SmartCreativeAutoRefresh> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<SmartCreativeAutoRefresh>): Promise<SmartCreativeAutoRefresh> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`SmartCreativeAutoRefresh ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing SmartCreativeAutoRefresh ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`SmartCreativeAutoRefresh ${id} not found`);
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
