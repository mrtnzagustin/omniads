import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetailMediaNetworkHubService } from './retail-media-network-hub.service';
import { RetailMediaNetworkHubController } from './retail-media-network-hub.controller';
import { RetailMediaNetworkHub } from './retail-media-network-hub.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RetailMediaNetworkHub])],
  providers: [RetailMediaNetworkHubService],
  controllers: [RetailMediaNetworkHubController],
  exports: [RetailMediaNetworkHubService],
})
export class RetailMediaNetworkHubModule {}
