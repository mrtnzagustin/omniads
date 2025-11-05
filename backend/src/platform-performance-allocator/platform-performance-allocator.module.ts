import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformPerformanceAllocator } from '../database/entities/platform-performance-allocator.entity';
import { PlatformPerformanceAllocatorService } from './platform-performance-allocator.service';
import { PlatformPerformanceAllocatorController } from './platform-performance-allocator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformPerformanceAllocator])],
  controllers: [PlatformPerformanceAllocatorController],
  providers: [PlatformPerformanceAllocatorService],
  exports: [PlatformPerformanceAllocatorService],
})
export class PlatformPerformanceAllocatorModule {}
