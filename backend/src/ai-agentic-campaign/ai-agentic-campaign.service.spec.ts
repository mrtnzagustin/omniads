import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIAgenticCampaignService } from './ai-agentic-campaign.service';
import { AIAgent } from '../database/entities/ai-agent.entity';
import { AgentDecision } from '../database/entities/agent-decision.entity';
import { AgentOutcome } from '../database/entities/agent-outcome.entity';

describe('AIAgenticCampaignService', () => {
  let service: AIAgenticCampaignService;
  let agentRepository: Repository<AIAgent>;
  let decisionRepository: Repository<AgentDecision>;
  let outcomeRepository: Repository<AgentOutcome>;

  const mockWorkspaceId = 'workspace-123';

  const mockAgent: Partial<AIAgent> = {
    id: 'agent-1',
    workspaceId: mockWorkspaceId,
    name: 'Test Agent',
    goals: [{ type: 'roas', target: 4.0 }],
    constraints: {
      maxBudgetChange: 20,
      maxBidChange: 10,
      minConfidenceScore: 0.7,
      allowedActions: ['budget_change', 'bid_change'],
    },
    priority: 5,
    status: 'active',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIAgenticCampaignService,
        {
          provide: getRepositoryToken(AIAgent),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AgentDecision),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(AgentOutcome),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AIAgenticCampaignService>(AIAgenticCampaignService);
    agentRepository = module.get<Repository<AIAgent>>(getRepositoryToken(AIAgent));
    decisionRepository = module.get<Repository<AgentDecision>>(getRepositoryToken(AgentDecision));
    outcomeRepository = module.get<Repository<AgentOutcome>>(getRepositoryToken(AgentOutcome));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAgent', () => {
    it('should create an AI agent', async () => {
      const agentData = { ...mockAgent };
      jest.spyOn(agentRepository, 'create').mockReturnValue(agentData as AIAgent);
      jest.spyOn(agentRepository, 'save').mockResolvedValue(agentData as AIAgent);

      const result = await service.createAgent(mockWorkspaceId, agentData);

      expect(agentRepository.create).toHaveBeenCalledWith({ ...agentData, workspaceId: mockWorkspaceId });
      expect(agentRepository.save).toHaveBeenCalled();
      expect(result).toEqual(agentData);
    });
  });

  describe('findAllAgents', () => {
    it('should return all agents for a workspace', async () => {
      const agents = [mockAgent];
      jest.spyOn(agentRepository, 'find').mockResolvedValue(agents as AIAgent[]);

      const result = await service.findAllAgents(mockWorkspaceId);

      expect(agentRepository.find).toHaveBeenCalledWith({ where: { workspaceId: mockWorkspaceId } });
      expect(result).toEqual(agents);
    });
  });

  describe('findAgent', () => {
    it('should return a specific agent', async () => {
      jest.spyOn(agentRepository, 'findOne').mockResolvedValue(mockAgent as AIAgent);

      const result = await service.findAgent(mockWorkspaceId, 'agent-1');

      expect(agentRepository.findOne).toHaveBeenCalledWith({
        where: { workspaceId: mockWorkspaceId, id: 'agent-1' },
      });
      expect(result).toEqual(mockAgent);
    });
  });

  describe('updateAgent', () => {
    it('should update an agent', async () => {
      const updateData = { status: 'paused' };
      jest.spyOn(agentRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(agentRepository, 'findOne').mockResolvedValue({ ...mockAgent, ...updateData } as AIAgent);

      const result = await service.updateAgent(mockWorkspaceId, 'agent-1', updateData);

      expect(agentRepository.update).toHaveBeenCalledWith(
        { workspaceId: mockWorkspaceId, id: 'agent-1' },
        updateData,
      );
      expect(result.status).toBe('paused');
    });
  });

  describe('deleteAgent', () => {
    it('should delete an agent', async () => {
      jest.spyOn(agentRepository, 'delete').mockResolvedValue(undefined);

      await service.deleteAgent(mockWorkspaceId, 'agent-1');

      expect(agentRepository.delete).toHaveBeenCalledWith({ workspaceId: mockWorkspaceId, id: 'agent-1' });
    });
  });

  describe('createDecision', () => {
    it('should create an agent decision', async () => {
      const decisionData = {
        agentId: 'agent-1',
        campaignId: 'campaign-1',
        actionType: 'budget_change',
        actionDetails: { oldBudget: 100, newBudget: 120 },
        reasoning: 'Campaign performing above target',
        confidenceScore: 0.85,
      };
      jest.spyOn(decisionRepository, 'create').mockReturnValue(decisionData as any);
      jest.spyOn(decisionRepository, 'save').mockResolvedValue(decisionData as any);

      const result = await service.createDecision(mockWorkspaceId, decisionData);

      expect(decisionRepository.create).toHaveBeenCalledWith({ ...decisionData, workspaceId: mockWorkspaceId });
      expect(result).toEqual(decisionData);
    });
  });
});
