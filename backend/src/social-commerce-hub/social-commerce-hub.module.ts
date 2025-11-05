import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialCommerceHub } from '../database/entities/social-commerce-hub.entity';
import { SocialCommerceHubController } from './social-commerce-hub.controller';
import { SocialCommerceHubService } from './social-commerce-hub.service';

@Module({
  imports: [TypeOrmModule.forFeature([SocialCommerceHub])],
  controllers: [SocialCommerceHubController],
  providers: [SocialCommerceHubService],
  exports: [SocialCommerceHubService],
})
export class SocialCommerceHubModule {}
