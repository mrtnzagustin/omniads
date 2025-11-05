import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyFirstAttributionModelController } from './privacy-first-attribution-model.controller';
import { PrivacyFirstAttributionModelService } from './privacy-first-attribution-model.service';
import { AttributionModel095 } from '../database/entities/features-088-107';

@Module({
  imports: [TypeOrmModule.forFeature([AttributionModel095])],
  controllers: [PrivacyFirstAttributionModelController],
  providers: [PrivacyFirstAttributionModelService],
  exports: [PrivacyFirstAttributionModelService],
})
export class PrivacyFirstAttributionModelModule {}
