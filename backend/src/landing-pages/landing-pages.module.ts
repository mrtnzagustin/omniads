import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPageTemplate } from '../database/entities/landing-page-template.entity';
import { LandingPageTemplateService } from './landing-pages.service';
import { LandingPageTemplateController } from './landing-pages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LandingPageTemplate])],
  providers: [LandingPageTemplateService],
  controllers: [LandingPageTemplateController],
  exports: [LandingPageTemplateService],
})
export class LandingPageTemplateModule {}
