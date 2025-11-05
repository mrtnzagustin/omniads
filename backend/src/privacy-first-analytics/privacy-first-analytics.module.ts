import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyFirstAnalyticsService } from './privacy-first-analytics.service';
import { PrivacyFirstAnalyticsController } from './privacy-first-analytics.controller';
import { PrivacyFirstAnalyticsEntity } from '../database/entities/privacy-first-analytics-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrivacyFirstAnalyticsEntity])],
  providers: [PrivacyFirstAnalyticsService],
  controllers: [PrivacyFirstAnalyticsController],
  exports: [PrivacyFirstAnalyticsService],
})
export class PrivacyFirstAnalyticsModule {}
