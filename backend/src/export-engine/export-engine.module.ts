import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportJob } from '../database/entities/export-job.entity';
import { ExportEngineService } from './export-engine.service';
import { ExportEngineController } from './export-engine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ExportJob])],
  controllers: [ExportEngineController],
  providers: [ExportEngineService],
  exports: [ExportEngineService],
})
export class ExportEngineModule {}
