import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AICustomerServiceService } from './ai-customer-service.service';
import { AICustomerServiceController } from './ai-customer-service.controller';
import { AICustomerServiceEntity } from '../database/entities/ai-customer-service-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AICustomerServiceEntity])],
  providers: [AICustomerServiceService],
  controllers: [AICustomerServiceController],
  exports: [AICustomerServiceService],
})
export class AICustomerServiceModule {}
