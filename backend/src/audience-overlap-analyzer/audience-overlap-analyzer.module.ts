import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudienceOverlapAnalyzer } from '../database/entities/audience-overlap-analyzer.entity';
import { AudienceOverlapAnalyzerController } from './audience-overlap-analyzer.controller';
import { AudienceOverlapAnalyzerService } from './audience-overlap-analyzer.service';

@Module({
  imports: [TypeOrmModule.forFeature([AudienceOverlapAnalyzer])],
  controllers: [AudienceOverlapAnalyzerController],
  providers: [AudienceOverlapAnalyzerService],
  exports: [AudienceOverlapAnalyzerService],
})
export class AudienceOverlapAnalyzerModule {}
