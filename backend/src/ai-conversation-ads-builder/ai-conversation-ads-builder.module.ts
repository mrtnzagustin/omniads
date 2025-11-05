import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiConversationAdsBuilderController } from './ai-conversation-ads-builder.controller';
import { AiConversationAdsBuilderService } from './ai-conversation-ads-builder.service';
import { ConversationAd } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationAd])],
  controllers: [AiConversationAdsBuilderController],
  providers: [AiConversationAdsBuilderService],
  exports: [AiConversationAdsBuilderService],
})
export class AiConversationAdsBuilderModule {}
