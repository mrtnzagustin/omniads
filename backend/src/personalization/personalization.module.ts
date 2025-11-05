import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalizationRule } from '../database/entities/personalization-rule.entity';
import { PersonalizationRuleService } from './personalization.service';
import { PersonalizationRuleController } from './personalization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalizationRule])],
  providers: [PersonalizationRuleService],
  controllers: [PersonalizationRuleController],
  exports: [PersonalizationRuleService],
})
export class PersonalizationRuleModule {}
