import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntelligentFrequencyCapper } from '../database/entities/intelligent-frequency-capper.entity';
import { IntelligentFrequencyCapperService } from './intelligent-frequency-capper.service';
import { IntelligentFrequencyCapperController } from './intelligent-frequency-capper.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IntelligentFrequencyCapper])],
  controllers: [IntelligentFrequencyCapperController],
  providers: [IntelligentFrequencyCapperService],
  exports: [IntelligentFrequencyCapperService],
})
export class IntelligentFrequencyCapperModule {}
