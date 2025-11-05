import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributionController } from './attribution.controller';
import { AttributionService } from './attribution.service';
import { TouchpointEvent } from '../database/entities/touchpoint-event.entity';
import { ConversionPath } from '../database/entities/conversion-path.entity';
import { AttributionResult } from '../database/entities/attribution-result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TouchpointEvent,
      ConversionPath,
      AttributionResult,
    ]),
  ],
  controllers: [AttributionController],
  providers: [AttributionService],
  exports: [AttributionService],
})
export class AttributionModule {}
