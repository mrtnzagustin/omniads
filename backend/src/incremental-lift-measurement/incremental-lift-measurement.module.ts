import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncrementalLiftMeasurement } from '../database/entities/incremental-lift-measurement.entity';
import { IncrementalLiftMeasurementController } from './incremental-lift-measurement.controller';
import { IncrementalLiftMeasurementService } from './incremental-lift-measurement.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncrementalLiftMeasurement])],
  controllers: [IncrementalLiftMeasurementController],
  providers: [IncrementalLiftMeasurementService],
  exports: [IncrementalLiftMeasurementService],
})
export class IncrementalLiftMeasurementModule {}
