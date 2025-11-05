import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiObjectiveBalancer } from '../database/entities/multi-objective-balancer.entity';
import { MultiObjectiveBalancerService } from './multi-objective-balancer.service';
import { MultiObjectiveBalancerController } from './multi-objective-balancer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MultiObjectiveBalancer])],
  controllers: [MultiObjectiveBalancerController],
  providers: [MultiObjectiveBalancerService],
  exports: [MultiObjectiveBalancerService],
})
export class MultiObjectiveBalancerModule {}
