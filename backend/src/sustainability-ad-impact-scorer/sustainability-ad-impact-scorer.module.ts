import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SustainabilityAdImpactScorerService } from './sustainability-ad-impact-scorer.service';
import { SustainabilityAdImpactScorerController } from './sustainability-ad-impact-scorer.controller';
import { SustainabilityAdImpactScorer } from './sustainability-ad-impact-scorer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SustainabilityAdImpactScorer])],
  providers: [SustainabilityAdImpactScorerService],
  controllers: [SustainabilityAdImpactScorerController],
  exports: [SustainabilityAdImpactScorerService],
})
export class SustainabilityAdImpactScorerModule {}
