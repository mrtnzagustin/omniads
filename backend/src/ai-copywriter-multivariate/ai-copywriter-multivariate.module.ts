import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AICopywriterMultivariateService } from './ai-copywriter-multivariate.service';
import { AICopywriterMultivariateController } from './ai-copywriter-multivariate.controller';
import { AICopywriterMultivariate } from './ai-copywriter-multivariate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AICopywriterMultivariate])],
  providers: [AICopywriterMultivariateService],
  controllers: [AICopywriterMultivariateController],
  exports: [AICopywriterMultivariateService],
})
export class AICopywriterMultivariateModule {}
