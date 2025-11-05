import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossPlatformSymphonyIntegration } from './cross-platform-symphony-integration.entity';

@Injectable()
export class CrossPlatformSymphonyIntegrationService {
  private readonly logger = new Logger(CrossPlatformSymphonyIntegrationService.name);

  constructor(
    @InjectRepository(CrossPlatformSymphonyIntegration)
    private repository: Repository<CrossPlatformSymphonyIntegration>,
  ) {}

  async findAll(): Promise<CrossPlatformSymphonyIntegration[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<CrossPlatformSymphonyIntegration | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<CrossPlatformSymphonyIntegration>): Promise<CrossPlatformSymphonyIntegration> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<CrossPlatformSymphonyIntegration>): Promise<CrossPlatformSymphonyIntegration> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`CrossPlatformSymphonyIntegration ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing CrossPlatformSymphonyIntegration ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`CrossPlatformSymphonyIntegration ${id} not found`);
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
