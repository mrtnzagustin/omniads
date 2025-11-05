import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../database/entities/campaign.entity';
import { Product } from '../database/entities/product.entity';
import { Sale } from '../database/entities/sale.entity';
import { Recommendation } from '../database/entities/recommendation.entity';
import { AIRequestLog } from '../database/entities/ai-request-log.entity';
import { DataSyncService } from './data-sync.service';
import { AICoreClient } from './ai-core.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, Product, Sale, Recommendation, AIRequestLog]),
  ],
  providers: [DataSyncService, AICoreClient],
  exports: [DataSyncService, AICoreClient],
})
export class ServicesModule {}
