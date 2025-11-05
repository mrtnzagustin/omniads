import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionRetentionService } from './subscription-retention.service';
import { SubscriptionRetentionController } from './subscription-retention.controller';
import { SubscriptionRetentionEntity } from '../database/entities/subscription-retention-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionRetentionEntity])],
  providers: [SubscriptionRetentionService],
  controllers: [SubscriptionRetentionController],
  exports: [SubscriptionRetentionService],
})
export class SubscriptionRetentionModule {}
