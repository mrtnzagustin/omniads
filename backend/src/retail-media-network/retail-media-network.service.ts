import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetailMediaNetworkEntity } from '../database/entities/retail-media-network-main.entity';

@Injectable()
export class RetailMediaNetworkService {
  constructor(
    @InjectRepository(RetailMediaNetworkEntity)
    private repository: Repository<RetailMediaNetworkEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<RetailMediaNetworkEntity>): Promise<RetailMediaNetworkEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<RetailMediaNetworkEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<RetailMediaNetworkEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<RetailMediaNetworkEntity>): Promise<RetailMediaNetworkEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
