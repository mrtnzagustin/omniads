import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainAdVerificationService } from './blockchain-ad-verification.service';
import { BlockchainAdVerificationController } from './blockchain-ad-verification.controller';
import { BlockchainAdVerificationEntity } from '../database/entities/blockchain-ad-verification-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlockchainAdVerificationEntity])],
  providers: [BlockchainAdVerificationService],
  controllers: [BlockchainAdVerificationController],
  exports: [BlockchainAdVerificationService],
})
export class BlockchainAdVerificationModule {}
