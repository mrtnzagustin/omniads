import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GamificationLoyaltyEntity } from '../database/entities/gamification-loyalty-main.entity';

@Injectable()
export class GamificationLoyaltyService {
  constructor(
    @InjectRepository(GamificationLoyaltyEntity)
    private repository: Repository<GamificationLoyaltyEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<GamificationLoyaltyEntity>): Promise<GamificationLoyaltyEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<GamificationLoyaltyEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<GamificationLoyaltyEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<GamificationLoyaltyEntity>): Promise<GamificationLoyaltyEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
