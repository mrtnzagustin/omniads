import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvancedAbTestFramework } from '../database/entities/advanced-ab-test-framework.entity';
import { AdvancedAbTestFrameworkController } from './advanced-ab-test-framework.controller';
import { AdvancedAbTestFrameworkService } from './advanced-ab-test-framework.service';

@Module({
  imports: [TypeOrmModule.forFeature([AdvancedAbTestFramework])],
  controllers: [AdvancedAbTestFrameworkController],
  providers: [AdvancedAbTestFrameworkService],
  exports: [AdvancedAbTestFrameworkService],
})
export class AdvancedAbTestFrameworkModule {}
