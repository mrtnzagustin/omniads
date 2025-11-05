import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Web3MetaverseService } from './web3-metaverse.service';
import { Web3MetaverseController } from './web3-metaverse.controller';
import { Web3MetaverseEntity } from '../database/entities/web3-metaverse-main.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Web3MetaverseEntity])],
  providers: [Web3MetaverseService],
  controllers: [Web3MetaverseController],
  exports: [Web3MetaverseService],
})
export class Web3MetaverseModule {}
