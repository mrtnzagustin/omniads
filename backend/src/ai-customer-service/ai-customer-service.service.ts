import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AICustomerServiceEntity } from '../database/entities/ai-customer-service-main.entity';

@Injectable()
export class AICustomerServiceService {
  constructor(
    @InjectRepository(AICustomerServiceEntity)
    private repository: Repository<AICustomerServiceEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<AICustomerServiceEntity>): Promise<AICustomerServiceEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<AICustomerServiceEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<AICustomerServiceEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<AICustomerServiceEntity>): Promise<AICustomerServiceEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
