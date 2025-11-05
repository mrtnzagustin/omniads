import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from '../database/entities/keyword.entity';
import { KeywordPerformance } from '../database/entities/keyword-performance.entity';
import { BiddingRecommendation } from '../database/entities/bidding-recommendation.entity';
import { KeywordIntelligenceService } from './keyword-intelligence.service';
import { KeywordIntelligenceController } from './keyword-intelligence.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Keyword,
      KeywordPerformance,
      BiddingRecommendation,
    ]),
  ],
  controllers: [KeywordIntelligenceController],
  providers: [KeywordIntelligenceService],
  exports: [KeywordIntelligenceService],
})
export class KeywordIntelligenceModule {}
