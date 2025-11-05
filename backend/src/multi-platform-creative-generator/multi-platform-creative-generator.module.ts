import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiPlatformCreativeGenerator } from '../database/entities/multi-platform-creative-generator.entity';
import { MultiPlatformCreativeGeneratorController } from './multi-platform-creative-generator.controller';
import { MultiPlatformCreativeGeneratorService } from './multi-platform-creative-generator.service';

@Module({
  imports: [TypeOrmModule.forFeature([MultiPlatformCreativeGenerator])],
  controllers: [MultiPlatformCreativeGeneratorController],
  providers: [MultiPlatformCreativeGeneratorService],
  exports: [MultiPlatformCreativeGeneratorService],
})
export class MultiPlatformCreativeGeneratorModule {}
