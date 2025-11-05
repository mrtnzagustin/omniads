import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiTouchAttributionProController } from './multi-touch-attribution-pro.controller';
import { MultiTouchAttributionProService } from './multi-touch-attribution-pro.service';
import { CustomerJourney106 } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerJourney106])],
  controllers: [MultiTouchAttributionProController],
  providers: [MultiTouchAttributionProService],
  exports: [MultiTouchAttributionProService],
})
export class MultiTouchAttributionProModule {}
