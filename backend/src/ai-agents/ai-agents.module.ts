import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIAgent } from '../database/entities/ai-agent.entity';
import { AIAgentService } from './ai-agents.service';
import { AIAgentController } from './ai-agents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AIAgent])],
  providers: [AIAgentService],
  controllers: [AIAgentController],
  exports: [AIAgentService],
})
export class AIAgentModule {}
