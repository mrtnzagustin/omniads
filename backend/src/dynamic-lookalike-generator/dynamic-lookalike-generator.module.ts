import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicLookalikeGenerator } from '../database/entities/dynamic-lookalike-generator.entity';
import { DynamicLookalikeGeneratorService } from './dynamic-lookalike-generator.service';
import { DynamicLookalikeGeneratorController } from './dynamic-lookalike-generator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicLookalikeGenerator])],
  controllers: [DynamicLookalikeGeneratorController],
  providers: [DynamicLookalikeGeneratorService],
  exports: [DynamicLookalikeGeneratorService],
})
export class DynamicLookalikeGeneratorModule {}
