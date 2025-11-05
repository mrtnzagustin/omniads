import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiComplianceGuardian } from '../database/entities/ai-compliance-guardian.entity';
import { AiComplianceGuardianService } from './ai-compliance-guardian.service';
import { AiComplianceGuardianController } from './ai-compliance-guardian.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiComplianceGuardian])],
  controllers: [AiComplianceGuardianController],
  providers: [AiComplianceGuardianService],
  exports: [AiComplianceGuardianService],
})
export class AiComplianceGuardianModule {}
