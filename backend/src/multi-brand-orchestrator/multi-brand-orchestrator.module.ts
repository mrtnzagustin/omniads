import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandPortfolio } from '../database/entities/brand-portfolio.entity';
import { MultiBrandOrchestratorService } from './multi-brand-orchestrator.service';
import { MultiBrandOrchestratorController } from './multi-brand-orchestrator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BrandPortfolio])],
  controllers: [MultiBrandOrchestratorController],
  providers: [MultiBrandOrchestratorService],
  exports: [MultiBrandOrchestratorService],
})
export class MultiBrandOrchestratorModule {}
