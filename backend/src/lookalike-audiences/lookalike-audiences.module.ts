import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LookalikeModel } from '../database/entities/lookalike-model.entity';
import { LookalikeModelService } from './lookalike-audiences.service';
import { LookalikeModelController } from './lookalike-audiences.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LookalikeModel])],
  providers: [LookalikeModelService],
  controllers: [LookalikeModelController],
  exports: [LookalikeModelService],
})
export class LookalikeModelModule {}
