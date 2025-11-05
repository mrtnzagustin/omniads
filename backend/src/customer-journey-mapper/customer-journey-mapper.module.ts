import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerJourneyMapper } from '../database/entities/customer-journey-mapper.entity';
import { CustomerJourneyMapperController } from './customer-journey-mapper.controller';
import { CustomerJourneyMapperService } from './customer-journey-mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerJourneyMapper])],
  controllers: [CustomerJourneyMapperController],
  providers: [CustomerJourneyMapperService],
  exports: [CustomerJourneyMapperService],
})
export class CustomerJourneyMapperModule {}
