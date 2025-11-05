import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAdSyncEngine } from '../database/entities/email-ad-sync-engine.entity';
import { EmailAdSyncEngineController } from './email-ad-sync-engine.controller';
import { EmailAdSyncEngineService } from './email-ad-sync-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailAdSyncEngine])],
  controllers: [EmailAdSyncEngineController],
  providers: [EmailAdSyncEngineService],
  exports: [EmailAdSyncEngineService],
})
export class EmailAdSyncEngineModule {}
