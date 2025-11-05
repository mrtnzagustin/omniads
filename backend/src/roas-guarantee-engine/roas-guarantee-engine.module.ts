import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ROASGuaranteeEngineService } from './roas-guarantee-engine.service';
import { ROASGuaranteeEngineController } from './roas-guarantee-engine.controller';
import { ROASGuaranteeEngine } from './roas-guarantee-engine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ROASGuaranteeEngine])],
  providers: [ROASGuaranteeEngineService],
  controllers: [ROASGuaranteeEngineController],
  exports: [ROASGuaranteeEngineService],
})
export class ROASGuaranteeEngineModule {}
