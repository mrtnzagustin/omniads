import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandSafetyAiGuardianController } from './brand-safety-ai-guardian.controller';
import { BrandSafetyAiGuardianService } from './brand-safety-ai-guardian.service';
import { BrandSafetyRule105 } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([BrandSafetyRule105])],
  controllers: [BrandSafetyAiGuardianController],
  providers: [BrandSafetyAiGuardianService],
  exports: [BrandSafetyAiGuardianService],
})
export class BrandSafetyAiGuardianModule {}
