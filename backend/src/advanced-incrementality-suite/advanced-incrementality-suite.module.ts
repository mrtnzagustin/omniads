import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvancedIncrementalitySuiteController } from './advanced-incrementality-suite.controller';
import { AdvancedIncrementalitySuiteService } from './advanced-incrementality-suite.service';
import { IncrementalityExperiment } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([IncrementalityExperiment])],
  controllers: [AdvancedIncrementalitySuiteController],
  providers: [AdvancedIncrementalitySuiteService],
  exports: [AdvancedIncrementalitySuiteService],
})
export class AdvancedIncrementalitySuiteModule {}
