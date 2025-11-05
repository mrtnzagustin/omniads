import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIMaxCampaignReplicatorService } from './ai-max-campaign-replicator.service';
import { AIMaxCampaignReplicatorController } from './ai-max-campaign-replicator.controller';
import { AIMaxCampaignReplicator } from './ai-max-campaign-replicator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AIMaxCampaignReplicator])],
  providers: [AIMaxCampaignReplicatorService],
  controllers: [AIMaxCampaignReplicatorController],
  exports: [AIMaxCampaignReplicatorService],
})
export class AIMaxCampaignReplicatorModule {}
