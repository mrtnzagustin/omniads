import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorInfluencerCRMService } from './creator-influencer-crm.service';
import { CreatorInfluencerCRMController } from './creator-influencer-crm.controller';
import { CreatorInfluencerCRMEntity } from '../database/entities/creator-influencer-crm-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorInfluencerCRMEntity])],
  providers: [CreatorInfluencerCRMService],
  controllers: [CreatorInfluencerCRMController],
  exports: [CreatorInfluencerCRMService],
})
export class CreatorInfluencerCRMModule {}
