import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartCreativeAutoRefreshService } from './smart-creative-auto-refresh.service';
import { SmartCreativeAutoRefreshController } from './smart-creative-auto-refresh.controller';
import { SmartCreativeAutoRefresh } from './smart-creative-auto-refresh.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SmartCreativeAutoRefresh])],
  providers: [SmartCreativeAutoRefreshService],
  controllers: [SmartCreativeAutoRefreshController],
  exports: [SmartCreativeAutoRefreshService],
})
export class SmartCreativeAutoRefreshModule {}
