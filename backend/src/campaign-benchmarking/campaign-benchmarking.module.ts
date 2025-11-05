import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignBenchmark } from '../database/entities/campaign-benchmark.entity';
import { CampaignBenchmarkingService } from './campaign-benchmarking.service';
import { CampaignBenchmarkingController } from './campaign-benchmarking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignBenchmark])],
  controllers: [CampaignBenchmarkingController],
  providers: [CampaignBenchmarkingService],
  exports: [CampaignBenchmarkingService],
})
export class CampaignBenchmarkingModule {}
