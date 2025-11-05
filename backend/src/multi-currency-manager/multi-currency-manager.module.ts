import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiCurrencyManager } from '../database/entities/multi-currency-manager.entity';
import { MultiCurrencyManagerController } from './multi-currency-manager.controller';
import { MultiCurrencyManagerService } from './multi-currency-manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([MultiCurrencyManager])],
  controllers: [MultiCurrencyManagerController],
  providers: [MultiCurrencyManagerService],
  exports: [MultiCurrencyManagerService],
})
export class MultiCurrencyManagerModule {}
