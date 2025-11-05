import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIAgenticCampaignService } from './ai-agentic-campaign.service';
import { AIAgenticCampaignController } from './ai-agentic-campaign.controller';
import { AIAgent } from '../database/entities/ai-agent.entity';
import { AgentDecision } from '../database/entities/agent-decision.entity';
import { AgentOutcome } from '../database/entities/agent-outcome.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AIAgent, AgentDecision, AgentOutcome])],
  providers: [AIAgenticCampaignService],
  controllers: [AIAgenticCampaignController],
  exports: [AIAgenticCampaignService],
})
export class AIAgenticCampaignModule {}
