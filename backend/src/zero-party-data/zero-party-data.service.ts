import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataCollectionForm } from '../database/entities/data-collection-form.entity';

@Injectable()
export class DataCollectionFormService {
  constructor(
    @InjectRepository(DataCollectionForm)
    private repository: Repository<DataCollectionForm>,
  ) {}

  async create(workspaceId: string, data: Partial<DataCollectionForm>): Promise<DataCollectionForm> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<DataCollectionForm[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<DataCollectionForm> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<DataCollectionForm>): Promise<DataCollectionForm> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
