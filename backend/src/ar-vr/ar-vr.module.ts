import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ARVRExperience } from '../database/entities/ar-vr-experience.entity';
import { ARVRExperienceService } from './ar-vr.service';
import { ARVRExperienceController } from './ar-vr.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ARVRExperience])],
  providers: [ARVRExperienceService],
  controllers: [ARVRExperienceController],
  exports: [ARVRExperienceService],
})
export class ARVRExperienceModule {}
