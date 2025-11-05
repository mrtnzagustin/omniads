import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstPartyDataEnrichmentHubService } from './first-party-data-enrichment-hub.service';
import { FirstPartyDataEnrichmentHubController } from './first-party-data-enrichment-hub.controller';
import { FirstPartyDataEnrichmentHub } from './first-party-data-enrichment-hub.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FirstPartyDataEnrichmentHub])],
  providers: [FirstPartyDataEnrichmentHubService],
  controllers: [FirstPartyDataEnrichmentHubController],
  exports: [FirstPartyDataEnrichmentHubService],
})
export class FirstPartyDataEnrichmentHubModule {}
