import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIVideoCreativeStudioService } from './ai-video-creative-studio.service';
import { AIVideoCreativeStudioController } from './ai-video-creative-studio.controller';
import { AIVideoCreativeStudioEntity } from '../database/entities/ai-video-creative-studio-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AIVideoCreativeStudioEntity])],
  providers: [AIVideoCreativeStudioService],
  controllers: [AIVideoCreativeStudioController],
  exports: [AIVideoCreativeStudioService],
})
export class AIVideoCreativeStudioModule {}
