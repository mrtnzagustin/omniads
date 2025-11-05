import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataCollectionForm } from '../database/entities/data-collection-form.entity';
import { DataCollectionFormService } from './zero-party-data.service';
import { DataCollectionFormController } from './zero-party-data.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DataCollectionForm])],
  providers: [DataCollectionFormService],
  controllers: [DataCollectionFormController],
  exports: [DataCollectionFormService],
})
export class DataCollectionFormModule {}
