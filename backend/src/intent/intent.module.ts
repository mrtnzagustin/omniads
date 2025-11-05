import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntentModel } from '../database/entities/intent-model.entity';
import { IntentModelService } from './intent.service';
import { IntentModelController } from './intent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IntentModel])],
  providers: [IntentModelService],
  controllers: [IntentModelController],
  exports: [IntentModelService],
})
export class IntentModelModule {}
