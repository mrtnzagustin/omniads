import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiCreativeTherapyController } from './ai-creative-therapy.controller';
import { AiCreativeTherapyService } from './ai-creative-therapy.service';
import { CreativeHealth } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([CreativeHealth])],
  controllers: [AiCreativeTherapyController],
  providers: [AiCreativeTherapyService],
  exports: [AiCreativeTherapyService],
})
export class AiCreativeTherapyModule {}
