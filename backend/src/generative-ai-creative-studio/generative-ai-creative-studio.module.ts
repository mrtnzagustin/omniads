import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenerativeAiCreativeStudio } from '../database/entities/generative-ai-creative-studio.entity';
import { GenerativeAiCreativeStudioController } from './generative-ai-creative-studio.controller';
import { GenerativeAiCreativeStudioService } from './generative-ai-creative-studio.service';

@Module({
  imports: [TypeOrmModule.forFeature([GenerativeAiCreativeStudio])],
  controllers: [GenerativeAiCreativeStudioController],
  providers: [GenerativeAiCreativeStudioService],
  exports: [GenerativeAiCreativeStudioService],
})
export class GenerativeAiCreativeStudioModule {}
