import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDataPlatformBridgeController } from './customer-data-platform-bridge.controller';
import { CustomerDataPlatformBridgeService } from './customer-data-platform-bridge.service';
import { CDPConnection } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([CDPConnection])],
  controllers: [CustomerDataPlatformBridgeController],
  providers: [CustomerDataPlatformBridgeService],
  exports: [CustomerDataPlatformBridgeService],
})
export class CustomerDataPlatformBridgeModule {}
