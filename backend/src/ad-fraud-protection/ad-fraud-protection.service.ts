import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdFraudProtectionEntity } from '../database/entities/ad-fraud-protection-main.entity';

@Injectable()
export class AdFraudProtectionService {
  constructor(
    @InjectRepository(AdFraudProtectionEntity)
    private repository: Repository<AdFraudProtectionEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<AdFraudProtectionEntity>): Promise<AdFraudProtectionEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<AdFraudProtectionEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<AdFraudProtectionEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<AdFraudProtectionEntity>): Promise<AdFraudProtectionEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
