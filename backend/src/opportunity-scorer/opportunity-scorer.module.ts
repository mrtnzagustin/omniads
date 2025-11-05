import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunityScorerService } from './opportunity-scorer.service';
import { OpportunityScorerController } from './opportunity-scorer.controller';
import { OpportunityScore } from '../database/entities/opportunity-score.entity';
import { PlatformOpportunityAggregate } from '../database/entities/platform-opportunity-aggregate.entity';
import { Campaign } from '../database/entities/campaign.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OpportunityScore,
      PlatformOpportunityAggregate,
      Campaign,
    ]),
  ],
  providers: [OpportunityScorerService],
  controllers: [OpportunityScorerController],
  exports: [OpportunityScorerService],
})
export class OpportunityScorerModule {}
