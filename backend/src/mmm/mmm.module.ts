import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MMMModel } from '../database/entities/mmm-model.entity';
import { MMMModelService } from './mmm.service';
import { MMMModelController } from './mmm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MMMModel])],
  providers: [MMMModelService],
  controllers: [MMMModelController],
  exports: [MMMModelService],
})
export class MMMModelModule {}
