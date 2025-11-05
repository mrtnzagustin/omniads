import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdFraudProtectionService } from './ad-fraud-protection.service';
import { AdFraudProtectionController } from './ad-fraud-protection.controller';
import { AdFraudProtectionEntity } from '../database/entities/ad-fraud-protection-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdFraudProtectionEntity])],
  providers: [AdFraudProtectionService],
  controllers: [AdFraudProtectionController],
  exports: [AdFraudProtectionService],
})
export class AdFraudProtectionModule {}
