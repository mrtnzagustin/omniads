import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartCampaignCloner } from '../database/entities/smart-campaign-cloner.entity';
import { SmartCampaignClonerService } from './smart-campaign-cloner.service';
import { SmartCampaignClonerController } from './smart-campaign-cloner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SmartCampaignCloner])],
  controllers: [SmartCampaignClonerController],
  providers: [SmartCampaignClonerService],
  exports: [SmartCampaignClonerService],
})
export class SmartCampaignClonerModule {}
