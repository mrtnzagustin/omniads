import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MicroInfluencerDiscoveryAiController } from './micro-influencer-discovery-ai.controller';
import { MicroInfluencerDiscoveryAiService } from './micro-influencer-discovery-ai.service';
import { Influencer } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([Influencer])],
  controllers: [MicroInfluencerDiscoveryAiController],
  providers: [MicroInfluencerDiscoveryAiService],
  exports: [MicroInfluencerDiscoveryAiService],
})
export class MicroInfluencerDiscoveryAiModule {}
