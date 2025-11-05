import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIAgent } from '../database/entities/ai-agent.entity';
import { AgentDecision } from '../database/entities/agent-decision.entity';
import { AgentOutcome } from '../database/entities/agent-outcome.entity';

@Injectable()
export class AIAgenticCampaignService {
  constructor(
    @InjectRepository(AIAgent)
    private agentRepository: Repository<AIAgent>,
    @InjectRepository(AgentDecision)
    private decisionRepository: Repository<AgentDecision>,
    @InjectRepository(AgentOutcome)
    private outcomeRepository: Repository<AgentOutcome>,
  ) {}

  async createAgent(workspaceId: string, data: Partial<AIAgent>): Promise<AIAgent> {
    const agent = this.agentRepository.create({ ...data, workspaceId });
    return this.agentRepository.save(agent);
  }

  async findAllAgents(workspaceId: string): Promise<AIAgent[]> {
    return this.agentRepository.find({ where: { workspaceId } });
  }

  async findAgent(workspaceId: string, id: string): Promise<AIAgent> {
    return this.agentRepository.findOne({ where: { workspaceId, id } });
  }

  async updateAgent(workspaceId: string, id: string, data: Partial<AIAgent>): Promise<AIAgent> {
    await this.agentRepository.update({ workspaceId, id }, data);
    return this.findAgent(workspaceId, id);
  }

  async deleteAgent(workspaceId: string, id: string): Promise<void> {
    await this.agentRepository.delete({ workspaceId, id });
  }

  async getAgentDecisions(workspaceId: string, agentId: string, limit = 100): Promise<AgentDecision[]> {
    return this.decisionRepository.find({
      where: { workspaceId, agentId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async createDecision(workspaceId: string, data: Partial<AgentDecision>): Promise<AgentDecision> {
    const decision = this.decisionRepository.create({ ...data, workspaceId });
    return this.decisionRepository.save(decision);
  }

  async getDecisionOutcomes(workspaceId: string, decisionId: string): Promise<AgentOutcome[]> {
    return this.outcomeRepository.find({ where: { workspaceId, decisionId } });
  }

  async trackOutcome(workspaceId: string, data: Partial<AgentOutcome>): Promise<AgentOutcome> {
    const outcome = this.outcomeRepository.create({ ...data, workspaceId });
    return this.outcomeRepository.save(outcome);
  }
}
