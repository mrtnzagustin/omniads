import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RealTimeBidOptimizationEntity } from '../database/entities/real-time-bid-optimization-main.entity';

@Injectable()
export class RealTimeBidOptimizationService {
  constructor(
    @InjectRepository(RealTimeBidOptimizationEntity)
    private repository: Repository<RealTimeBidOptimizationEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<RealTimeBidOptimizationEntity>): Promise<RealTimeBidOptimizationEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<RealTimeBidOptimizationEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<RealTimeBidOptimizationEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<RealTimeBidOptimizationEntity>): Promise<RealTimeBidOptimizationEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
