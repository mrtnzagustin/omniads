import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitiveAdIntelligenceClonerService } from './competitive-ad-intelligence-cloner.service';
import { CompetitiveAdIntelligenceClonerController } from './competitive-ad-intelligence-cloner.controller';
import { CompetitiveAdIntelligenceCloner } from './competitive-ad-intelligence-cloner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitiveAdIntelligenceCloner])],
  providers: [CompetitiveAdIntelligenceClonerService],
  controllers: [CompetitiveAdIntelligenceClonerController],
  exports: [CompetitiveAdIntelligenceClonerService],
})
export class CompetitiveAdIntelligenceClonerModule {}
