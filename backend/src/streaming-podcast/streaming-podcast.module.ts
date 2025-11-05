import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamingPodcastAdService } from './streaming-podcast.service';
import { StreamingPodcastAdController } from './streaming-podcast.controller';
import { StreamingPodcastAdEntity } from '../database/entities/streaming-podcast-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StreamingPodcastAdEntity])],
  providers: [StreamingPodcastAdService],
  controllers: [StreamingPodcastAdController],
  exports: [StreamingPodcastAdService],
})
export class StreamingPodcastAdModule {}
