import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntentModel } from '../database/entities/intent-model.entity';

@Injectable()
export class IntentModelService {
  constructor(
    @InjectRepository(IntentModel)
    private repository: Repository<IntentModel>,
  ) {}

  async create(workspaceId: string, data: Partial<IntentModel>): Promise<IntentModel> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<IntentModel[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<IntentModel> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<IntentModel>): Promise<IntentModel> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
