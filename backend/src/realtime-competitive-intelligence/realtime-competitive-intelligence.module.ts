import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RealtimeCompetitiveIntelligenceController } from './realtime-competitive-intelligence.controller';
import { RealtimeCompetitiveIntelligenceService } from './realtime-competitive-intelligence.service';
import { Competitor } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([Competitor])],
  controllers: [RealtimeCompetitiveIntelligenceController],
  providers: [RealtimeCompetitiveIntelligenceService],
  exports: [RealtimeCompetitiveIntelligenceService],
})
export class RealtimeCompetitiveIntelligenceModule {}
