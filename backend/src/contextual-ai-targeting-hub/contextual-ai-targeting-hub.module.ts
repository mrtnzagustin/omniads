import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextualAiTargetingHubController } from './contextual-ai-targeting-hub.controller';
import { ContextualAiTargetingHubService } from './contextual-ai-targeting-hub.service';
import { ContextualProfile } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([ContextualProfile])],
  controllers: [ContextualAiTargetingHubController],
  providers: [ContextualAiTargetingHubService],
  exports: [ContextualAiTargetingHubService],
})
export class ContextualAiTargetingHubModule {}
