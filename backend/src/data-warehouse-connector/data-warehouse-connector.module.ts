import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataWarehouseConnector } from '../database/entities/data-warehouse-connector.entity';
import { DataWarehouseConnectorController } from './data-warehouse-connector.controller';
import { DataWarehouseConnectorService } from './data-warehouse-connector.service';

@Module({
  imports: [TypeOrmModule.forFeature([DataWarehouseConnector])],
  controllers: [DataWarehouseConnectorController],
  providers: [DataWarehouseConnectorService],
  exports: [DataWarehouseConnectorService],
})
export class DataWarehouseConnectorModule {}
