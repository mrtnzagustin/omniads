import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsAppSubscription } from '../database/entities/whatsapp-subscription.entity';
import { WhatsAppDigest } from '../database/entities/whatsapp-digest.entity';
import { WhatsAppActionToken } from '../database/entities/whatsapp-action-token.entity';
import { WhatsAppConversationLog } from '../database/entities/whatsapp-conversation-log.entity';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WhatsAppSubscription,
      WhatsAppDigest,
      WhatsAppActionToken,
      WhatsAppConversationLog,
    ]),
  ],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
