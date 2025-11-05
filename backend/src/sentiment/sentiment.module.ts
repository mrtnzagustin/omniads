import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SentimentMonitor } from '../database/entities/sentiment-monitor.entity';
import { SentimentMonitorService } from './sentiment.service';
import { SentimentMonitorController } from './sentiment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SentimentMonitor])],
  providers: [SentimentMonitorService],
  controllers: [SentimentMonitorController],
  exports: [SentimentMonitorService],
})
export class SentimentMonitorModule {}
