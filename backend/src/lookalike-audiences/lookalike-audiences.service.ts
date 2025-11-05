import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LookalikeModel } from '../database/entities/lookalike-model.entity';

@Injectable()
export class LookalikeModelService {
  constructor(
    @InjectRepository(LookalikeModel)
    private repository: Repository<LookalikeModel>,
  ) {}

  async create(workspaceId: string, data: Partial<LookalikeModel>): Promise<LookalikeModel> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<LookalikeModel[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<LookalikeModel> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<LookalikeModel>): Promise<LookalikeModel> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
