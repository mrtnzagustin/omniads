import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialListeningService } from './social-listening.service';
import { SocialListeningController } from './social-listening.controller';
import { SocialListeningEntity } from '../database/entities/social-listening-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialListeningEntity])],
  providers: [SocialListeningService],
  controllers: [SocialListeningController],
  exports: [SocialListeningService],
})
export class SocialListeningModule {}
