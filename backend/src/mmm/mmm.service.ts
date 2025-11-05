import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MMMModel } from '../database/entities/mmm-model.entity';

@Injectable()
export class MMMModelService {
  constructor(
    @InjectRepository(MMMModel)
    private repository: Repository<MMMModel>,
  ) {}

  async create(workspaceId: string, data: Partial<MMMModel>): Promise<MMMModel> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<MMMModel[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<MMMModel> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<MMMModel>): Promise<MMMModel> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
