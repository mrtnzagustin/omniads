import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ROASGuaranteeEngine } from './roas-guarantee-engine.entity';

@Injectable()
export class ROASGuaranteeEngineService {
  private readonly logger = new Logger(ROASGuaranteeEngineService.name);

  constructor(
    @InjectRepository(ROASGuaranteeEngine)
    private repository: Repository<ROASGuaranteeEngine>,
  ) {}

  async findAll(): Promise<ROASGuaranteeEngine[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<ROASGuaranteeEngine | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<ROASGuaranteeEngine>): Promise<ROASGuaranteeEngine> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: Partial<ROASGuaranteeEngine>): Promise<ROASGuaranteeEngine> {
    await this.repository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error(`ROASGuaranteeEngine ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async process(id: string): Promise<any> {
    this.logger.log(`Processing ROASGuaranteeEngine ${id}`);
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error(`ROASGuaranteeEngine ${id} not found`);
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
