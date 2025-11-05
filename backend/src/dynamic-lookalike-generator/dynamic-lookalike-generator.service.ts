import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicLookalikeGenerator } from '../database/entities/dynamic-lookalike-generator.entity';

export interface CreateDynamicLookalikeGeneratorDto {
  userId: string;
  name: string;
  description: string;
  configuration: {
    enabled: boolean;
    settings: Record<string, any>;
  };
}

@Injectable()
export class DynamicLookalikeGeneratorService {
  constructor(
    @InjectRepository(DynamicLookalikeGenerator)
    private repository: Repository<DynamicLookalikeGenerator>,
  ) {}

  async create(dto: CreateDynamicLookalikeGeneratorDto): Promise<DynamicLookalikeGenerator> {
    const entity = this.repository.create({
      ...dto,
      status: 'active',
      metrics: {
        totalProcessed: 0,
        successRate: 0,
        lastRun: new Date()
      }
    });

    return await this.repository.save(entity);
  }

  async findAllByUser(userId: string): Promise<DynamicLookalikeGenerator[]> {
    return await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<DynamicLookalikeGenerator | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async analyze(id: string): Promise<any> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new Error('Dynamic lookalike generator not found');
    }

    return {
      id: entity.id,
      name: entity.name,
      analysis: {
        status: entity.status,
        metrics: entity.metrics
      },
      recommendations: ['Configure settings for optimal performance']
    };
  }

  async update(id: string, updates: Partial<DynamicLookalikeGenerator>): Promise<DynamicLookalikeGenerator> {
    await this.repository.update(id, updates);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new Error('Dynamic lookalike generator not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
