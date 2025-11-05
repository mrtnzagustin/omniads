import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnifiedSocialInboxService } from './unified-social-inbox.service';
import { UnifiedSocialInboxController } from './unified-social-inbox.controller';
import { UnifiedSocialInbox } from './unified-social-inbox.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnifiedSocialInbox])],
  providers: [UnifiedSocialInboxService],
  controllers: [UnifiedSocialInboxController],
  exports: [UnifiedSocialInboxService],
})
export class UnifiedSocialInboxModule {}
