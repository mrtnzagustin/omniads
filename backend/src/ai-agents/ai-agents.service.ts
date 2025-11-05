import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIAgent } from '../database/entities/ai-agent.entity';

@Injectable()
export class AIAgentService {
  constructor(
    @InjectRepository(AIAgent)
    private repository: Repository<AIAgent>,
  ) {}

  async create(workspaceId: string, data: Partial<AIAgent>): Promise<AIAgent> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<AIAgent[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<AIAgent> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<AIAgent>): Promise<AIAgent> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
