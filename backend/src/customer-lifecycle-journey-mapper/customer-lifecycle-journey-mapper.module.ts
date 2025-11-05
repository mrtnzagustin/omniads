import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerLifecycleJourneyMapperService } from './customer-lifecycle-journey-mapper.service';
import { CustomerLifecycleJourneyMapperController } from './customer-lifecycle-journey-mapper.controller';
import { CustomerLifecycleJourneyMapper } from './customer-lifecycle-journey-mapper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerLifecycleJourneyMapper])],
  providers: [CustomerLifecycleJourneyMapperService],
  controllers: [CustomerLifecycleJourneyMapperController],
  exports: [CustomerLifecycleJourneyMapperService],
})
export class CustomerLifecycleJourneyMapperModule {}
