import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeepLearningAudienceService } from './deep-learning-audience.service';
import { DeepLearningAudienceController } from './deep-learning-audience.controller';
import { DeepLearningAudienceEntity } from '../database/entities/deep-learning-audience-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeepLearningAudienceEntity])],
  providers: [DeepLearningAudienceService],
  controllers: [DeepLearningAudienceController],
  exports: [DeepLearningAudienceService],
})
export class DeepLearningAudienceModule {}
