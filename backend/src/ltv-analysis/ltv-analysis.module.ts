import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerLTV } from '../database/entities/customer-ltv.entity';
import { LTVAnalysisService } from './ltv-analysis.service';
import { LTVAnalysisController } from './ltv-analysis.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerLTV])],
  controllers: [LTVAnalysisController],
  providers: [LTVAnalysisService],
  exports: [LTVAnalysisService],
})
export class LTVAnalysisModule {}
