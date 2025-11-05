import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertRule } from '../database/entities/alert-rule.entity';
import { AlertRulesService } from './alert-rules.service';
import { AlertRulesController } from './alert-rules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlertRule])],
  controllers: [AlertRulesController],
  providers: [AlertRulesService],
  exports: [AlertRulesService],
})
export class AlertRulesModule {}
