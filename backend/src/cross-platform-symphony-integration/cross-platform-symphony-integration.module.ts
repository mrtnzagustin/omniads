import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrossPlatformSymphonyIntegrationService } from './cross-platform-symphony-integration.service';
import { CrossPlatformSymphonyIntegrationController } from './cross-platform-symphony-integration.controller';
import { CrossPlatformSymphonyIntegration } from './cross-platform-symphony-integration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrossPlatformSymphonyIntegration])],
  providers: [CrossPlatformSymphonyIntegrationService],
  controllers: [CrossPlatformSymphonyIntegrationController],
  exports: [CrossPlatformSymphonyIntegrationService],
})
export class CrossPlatformSymphonyIntegrationModule {}
