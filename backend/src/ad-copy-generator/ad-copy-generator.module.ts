import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdCopyTemplate } from '../database/entities/ad-copy-template.entity';
import { AdCopyGeneratorService } from './ad-copy-generator.service';
import { AdCopyGeneratorController } from './ad-copy-generator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdCopyTemplate])],
  controllers: [AdCopyGeneratorController],
  providers: [AdCopyGeneratorService],
  exports: [AdCopyGeneratorService],
})
export class AdCopyGeneratorModule {}
