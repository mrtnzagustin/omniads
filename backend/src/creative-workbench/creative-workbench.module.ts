import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativeAsset } from '../database/entities/creative-asset.entity';
import { CreativeMetricSnapshot } from '../database/entities/creative-metric-snapshot.entity';
import { CreativeCollection } from '../database/entities/creative-collection.entity';
import { CreativeCollectionItem } from '../database/entities/creative-collection-item.entity';
import { CreativeWorkbenchService } from './creative-workbench.service';
import { CreativeWorkbenchController } from './creative-workbench.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreativeAsset,
      CreativeMetricSnapshot,
      CreativeCollection,
      CreativeCollectionItem,
    ]),
  ],
  controllers: [CreativeWorkbenchController],
  providers: [CreativeWorkbenchService],
  exports: [CreativeWorkbenchService],
})
export class CreativeWorkbenchModule {}
