import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhatsAppSession } from '../database/entities/whats-app-session.entity';
import { WhatsAppSessionService } from './whatsapp-commerce.service';
import { WhatsAppSessionController } from './whatsapp-commerce.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WhatsAppSession])],
  providers: [WhatsAppSessionService],
  controllers: [WhatsAppSessionController],
  exports: [WhatsAppSessionService],
})
export class WhatsAppSessionModule {}
