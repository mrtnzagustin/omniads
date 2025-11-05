import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrossDeviceJourneyEntity } from '../database/entities/cross-device-journey-main.entity';

@Injectable()
export class CrossDeviceJourneyService {
  constructor(
    @InjectRepository(CrossDeviceJourneyEntity)
    private repository: Repository<CrossDeviceJourneyEntity>,
  ) {}

  async create(workspaceId: string, data: Partial<CrossDeviceJourneyEntity>): Promise<CrossDeviceJourneyEntity> {
    const entity = this.repository.create({ ...data, workspaceId });
    return this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<CrossDeviceJourneyEntity[]> {
    return this.repository.find({ where: { workspaceId } });
  }

  async findOne(workspaceId: string, id: string): Promise<CrossDeviceJourneyEntity> {
    return this.repository.findOne({ where: { workspaceId, id } });
  }

  async update(workspaceId: string, id: string, data: Partial<CrossDeviceJourneyEntity>): Promise<CrossDeviceJourneyEntity> {
    await this.repository.update({ workspaceId, id }, data);
    return this.findOne(workspaceId, id);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await this.repository.delete({ workspaceId, id });
  }
}
