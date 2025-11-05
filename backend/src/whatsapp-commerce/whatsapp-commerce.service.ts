import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WhatsAppSession } from '../database/entities/whats-app-session.entity';

@Injectable()
export class WhatsAppSessionService {
  constructor(
    @InjectRepository(WhatsAppSession)
    private repository: Repository<WhatsAppSession>,
  ) {}

  async create(workspaceId: string, data: Partial<WhatsAppSession>): Promise<WhatsAppSession> {
    const entity = this.repository.create({ ...data, workspaceId });
    return await this.repository.save(entity);
  }

  async findAll(workspaceId: string): Promise<WhatsAppSession[]> {
    return await this.repository.find({ where: { workspaceId } });
  }

  async findOne(id: string, workspaceId: string): Promise<WhatsAppSession> {
    return await this.repository.findOne({ where: { id, workspaceId } });
  }

  async update(id: string, workspaceId: string, data: Partial<WhatsAppSession>): Promise<WhatsAppSession> {
    await this.repository.update({ id, workspaceId }, data);
    return await this.findOne(id, workspaceId);
  }

  async remove(id: string, workspaceId: string): Promise<void> {
    await this.repository.delete({ id, workspaceId });
  }
}
