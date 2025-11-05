import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoiceSearchAdOptimizerService } from './voice-search-ad-optimizer.service';
import { VoiceSearchAdOptimizerController } from './voice-search-ad-optimizer.controller';
import { VoiceSearchAdOptimizer } from './voice-search-ad-optimizer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VoiceSearchAdOptimizer])],
  providers: [VoiceSearchAdOptimizerService],
  controllers: [VoiceSearchAdOptimizerController],
  exports: [VoiceSearchAdOptimizerService],
})
export class VoiceSearchAdOptimizerModule {}
