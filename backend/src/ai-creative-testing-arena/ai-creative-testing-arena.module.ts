import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AICreativeTestingArenaService } from './ai-creative-testing-arena.service';
import { AICreativeTestingArenaController } from './ai-creative-testing-arena.controller';
import { AICreativeTestingArena } from './ai-creative-testing-arena.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AICreativeTestingArena])],
  providers: [AICreativeTestingArenaService],
  controllers: [AICreativeTestingArenaController],
  exports: [AICreativeTestingArenaService],
})
export class AICreativeTestingArenaModule {}
