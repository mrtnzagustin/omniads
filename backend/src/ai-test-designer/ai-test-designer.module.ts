import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiTestDesigner } from '../database/entities/ai-test-designer.entity';
import { AiTestDesignerService } from './ai-test-designer.service';
import { AiTestDesignerController } from './ai-test-designer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiTestDesigner])],
  controllers: [AiTestDesignerController],
  providers: [AiTestDesignerService],
  exports: [AiTestDesignerService],
})
export class AiTestDesignerModule {}
