import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SequentialMessageConfig } from '../database/entities/sequential-message-config.entity';
import { SequentialMessageConfigService } from './sequential-messaging.service';
import { SequentialMessageConfigController } from './sequential-messaging.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SequentialMessageConfig])],
  providers: [SequentialMessageConfigService],
  controllers: [SequentialMessageConfigController],
  exports: [SequentialMessageConfigService],
})
export class SequentialMessageConfigModule {}
