import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncrementalityTest } from '../database/entities/incrementality-test.entity';
import { IncrementalityTestService } from './incrementality.service';
import { IncrementalityTestController } from './incrementality.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IncrementalityTest])],
  providers: [IncrementalityTestService],
  controllers: [IncrementalityTestController],
  exports: [IncrementalityTestService],
})
export class IncrementalityTestModule {}
