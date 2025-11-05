import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativeTest } from '../database/entities/creative-test.entity';
import { CreativeTestVariant } from '../database/entities/creative-test-variant.entity';
import { CreativeTestingService } from './creative-testing.service';
import { CreativeTestingController } from './creative-testing.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreativeTest, CreativeTestVariant])],
  controllers: [CreativeTestingController],
  providers: [CreativeTestingService],
  exports: [CreativeTestingService],
})
export class CreativeTestingModule {}
