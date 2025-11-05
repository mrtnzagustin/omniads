import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataEnrichmentConfig } from '../database/entities/data-enrichment-config.entity';
import { DataEnrichmentConfigService } from './data-enrichment.service';
import { DataEnrichmentConfigController } from './data-enrichment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DataEnrichmentConfig])],
  providers: [DataEnrichmentConfigService],
  controllers: [DataEnrichmentConfigController],
  exports: [DataEnrichmentConfigService],
})
export class DataEnrichmentConfigModule {}
