import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Web3MetaverseEntity } from '../database/entities/web3-metaverse-main.entity';

@Injectable()
export class Web3MetaverseService {
  constructor(
    @InjectRepository(Web3MetaverseEntity)
    private repository: Repository<Web3MetaverseEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<Web3MetaverseEntity>): Promise<Web3MetaverseEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<Web3MetaverseEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<Web3MetaverseEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<Web3MetaverseEntity>): Promise<Web3MetaverseEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
