import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrequencyConfig } from '../database/entities/frequency-config.entity';
import { FrequencyConfigService } from './frequency.service';
import { FrequencyConfigController } from './frequency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FrequencyConfig])],
  providers: [FrequencyConfigService],
  controllers: [FrequencyConfigController],
  exports: [FrequencyConfigService],
})
export class FrequencyConfigModule {}
