import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfluencerCampaignManager } from '../database/entities/influencer-campaign-manager.entity';
import { InfluencerCampaignManagerController } from './influencer-campaign-manager.controller';
import { InfluencerCampaignManagerService } from './influencer-campaign-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([InfluencerCampaignManager])],
  controllers: [InfluencerCampaignManagerController],
  providers: [InfluencerCampaignManagerService],
  exports: [InfluencerCampaignManagerService],
})
export class InfluencerCampaignManagerModule {}
