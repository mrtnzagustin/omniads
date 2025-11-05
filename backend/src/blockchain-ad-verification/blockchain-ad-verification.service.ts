import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockchainAdVerificationEntity } from '../database/entities/blockchain-ad-verification-main.entity';

@Injectable()
export class BlockchainAdVerificationService {
  constructor(
    @InjectRepository(BlockchainAdVerificationEntity)
    private repository: Repository<BlockchainAdVerificationEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<BlockchainAdVerificationEntity>): Promise<BlockchainAdVerificationEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<BlockchainAdVerificationEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<BlockchainAdVerificationEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<BlockchainAdVerificationEntity>): Promise<BlockchainAdVerificationEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
