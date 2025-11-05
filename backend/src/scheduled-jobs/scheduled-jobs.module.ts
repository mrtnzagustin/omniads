import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledJob } from '../database/entities/scheduled-job.entity';
import { JobExecution } from '../database/entities/job-execution.entity';
import { ScheduledJobsService } from './scheduled-jobs.service';
import { ScheduledJobsController, JobExecutionsController } from './scheduled-jobs.controller';
import { DataSyncService } from '../services/data-sync.service';
import { AICoreClient } from '../services/ai-core.client';
import { GoogleAdsClient } from '../services/google-ads.client';
import { MetaAdsClient } from '../services/meta-ads.client';
import { TikTokAdsClient } from '../services/tiktok-ads.client';
import { TiendaNubeClient } from '../services/tienda-nube.client';
import { Campaign } from '../database/entities/campaign.entity';
import { Product } from '../database/entities/product.entity';
import { Sales } from '../database/entities/sales.entity';
import { MerchantData } from '../database/entities/merchant-data.entity';
import { AIRequestLog } from '../database/entities/ai-request-log.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      ScheduledJob,
      JobExecution,
      Campaign,
      Product,
      Sales,
      MerchantData,
      AIRequestLog,
    ]),
  ],
  controllers: [ScheduledJobsController, JobExecutionsController],
  providers: [
    ScheduledJobsService,
    DataSyncService,
    AICoreClient,
    GoogleAdsClient,
    MetaAdsClient,
    TikTokAdsClient,
    TiendaNubeClient,
  ],
  exports: [ScheduledJobsService],
})
export class ScheduledJobsModule {}
