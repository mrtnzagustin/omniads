import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SustainabilityCarbonService } from './sustainability-carbon.service';
import { SustainabilityCarbonController } from './sustainability-carbon.controller';
import { SustainabilityCarbonEntity } from '../database/entities/sustainability-carbon-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SustainabilityCarbonEntity])],
  providers: [SustainabilityCarbonService],
  controllers: [SustainabilityCarbonController],
  exports: [SustainabilityCarbonService],
})
export class SustainabilityCarbonModule {}
