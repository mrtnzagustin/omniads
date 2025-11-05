import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationModel } from '../database/entities/recommendation-model.entity';
import { RecommendationModelService } from './product-recommendations.service';
import { RecommendationModelController } from './product-recommendations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationModel])],
  providers: [RecommendationModelService],
  controllers: [RecommendationModelController],
  exports: [RecommendationModelService],
})
export class RecommendationModelModule {}
