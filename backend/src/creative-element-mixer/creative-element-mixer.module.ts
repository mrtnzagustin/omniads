import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativeElementMixer } from '../database/entities/creative-element-mixer.entity';
import { CreativeElementMixerService } from './creative-element-mixer.service';
import { CreativeElementMixerController } from './creative-element-mixer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreativeElementMixer])],
  controllers: [CreativeElementMixerController],
  providers: [CreativeElementMixerService],
  exports: [CreativeElementMixerService],
})
export class CreativeElementMixerModule {}
