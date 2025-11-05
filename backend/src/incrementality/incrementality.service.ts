import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncrementalityTest } from '../database/entities/incrementality-test.entity';

@Injectable()
export class IncrementalityTestService {
  constructor(
    @InjectRepository(IncrementalityTest)
    private repository: Repository<IncrementalityTest>,
  ) {}

  async create(workspaceId: string, data: Partial<IncrementalityTest>): Promise<IncrementalityTest> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<IncrementalityTest[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<IncrementalityTest> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<IncrementalityTest>): Promise<IncrementalityTest> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
