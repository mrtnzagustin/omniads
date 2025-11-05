import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetailMediaNetworkService } from './retail-media-network.service';
import { RetailMediaNetworkController } from './retail-media-network.controller';
import { RetailMediaNetworkEntity } from '../database/entities/retail-media-network-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RetailMediaNetworkEntity])],
  providers: [RetailMediaNetworkService],
  controllers: [RetailMediaNetworkController],
  exports: [RetailMediaNetworkService],
})
export class RetailMediaNetworkModule {}
