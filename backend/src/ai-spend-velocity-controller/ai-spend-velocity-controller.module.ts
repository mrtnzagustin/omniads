import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiSpendVelocityController } from '../database/entities/ai-spend-velocity-controller.entity';
import { AiSpendVelocityControllerService } from './ai-spend-velocity-controller.service';
import { AiSpendVelocityControllerController } from './ai-spend-velocity-controller.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AiSpendVelocityController])],
  controllers: [AiSpendVelocityControllerController],
  providers: [AiSpendVelocityControllerService],
  exports: [AiSpendVelocityControllerService],
})
export class AiSpendVelocityControllerModule {}
