import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SentimentMonitor } from '../database/entities/sentiment-monitor.entity';

@Injectable()
export class SentimentMonitorService {
  constructor(
    @InjectRepository(SentimentMonitor)
    private repository: Repository<SentimentMonitor>,
  ) {}

  async create(workspaceId: string, data: Partial<SentimentMonitor>): Promise<SentimentMonitor> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<SentimentMonitor[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<SentimentMonitor> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<SentimentMonitor>): Promise<SentimentMonitor> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
