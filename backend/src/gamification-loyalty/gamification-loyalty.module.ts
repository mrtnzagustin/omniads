import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamificationLoyaltyService } from './gamification-loyalty.service';
import { GamificationLoyaltyController } from './gamification-loyalty.controller';
import { GamificationLoyaltyEntity } from '../database/entities/gamification-loyalty-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamificationLoyaltyEntity])],
  providers: [GamificationLoyaltyService],
  controllers: [GamificationLoyaltyController],
  exports: [GamificationLoyaltyService],
})
export class GamificationLoyaltyModule {}
