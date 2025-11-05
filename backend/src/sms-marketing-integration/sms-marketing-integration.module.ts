import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsMarketingIntegration } from '../database/entities/sms-marketing-integration.entity';
import { SmsMarketingIntegrationController } from './sms-marketing-integration.controller';
import { SmsMarketingIntegrationService } from './sms-marketing-integration.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmsMarketingIntegration])],
  controllers: [SmsMarketingIntegrationController],
  providers: [SmsMarketingIntegrationService],
  exports: [SmsMarketingIntegrationService],
})
export class SmsMarketingIntegrationModule {}
