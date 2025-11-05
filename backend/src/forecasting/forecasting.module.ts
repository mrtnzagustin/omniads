import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forecast } from '../database/entities/forecast.entity';
import { ForecastScenario } from '../database/entities/forecast-scenario.entity';
import { ForecastAccuracyLog } from '../database/entities/forecast-accuracy-log.entity';
import { SeasonalEvent } from '../database/entities/seasonal-event.entity';
import { ForecastingService } from './forecasting.service';
import {
  ForecastingController,
  ForecastScenariosController,
  SeasonalEventsController,
} from './forecasting.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Forecast,
      ForecastScenario,
      ForecastAccuracyLog,
      SeasonalEvent,
    ]),
  ],
  controllers: [
    ForecastingController,
    ForecastScenariosController,
    SeasonalEventsController,
  ],
  providers: [ForecastingService],
  exports: [ForecastingService],
})
export class ForecastingModule {}
