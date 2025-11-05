import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicLandingPageGeneratorService } from './dynamic-landing-page-generator.service';
import { DynamicLandingPageGeneratorController } from './dynamic-landing-page-generator.controller';
import { DynamicLandingPageGenerator } from './dynamic-landing-page-generator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicLandingPageGenerator])],
  providers: [DynamicLandingPageGeneratorService],
  controllers: [DynamicLandingPageGeneratorController],
  exports: [DynamicLandingPageGeneratorService],
})
export class DynamicLandingPageGeneratorModule {}
