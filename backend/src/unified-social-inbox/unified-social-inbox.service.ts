import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnifiedSocialInbox } from './unified-social-inbox.entity';

@Injectable()
export class UnifiedSocialInboxService {
  private readonly logger = new Logger(UnifiedSocialInboxService.name);

  constructor(
    @InjectRepository(UnifiedSocialInbox)
    private repository: Repository<UnifiedSocialInbox>,
  ) {}

  async findAll(): Promise<UnifiedSocialInbox[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<UnifiedSocialInbox | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<UnifiedSocialInbox>): Promise<UnifiedSocialInbox> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<UnifiedSocialInbox>): Promise<UnifiedSocialInbox> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`UnifiedSocialInbox ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing UnifiedSocialInbox ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`UnifiedSocialInbox ${id} not found`);
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
