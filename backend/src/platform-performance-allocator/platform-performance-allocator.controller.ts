import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PlatformPerformanceAllocatorService, CreatePlatformPerformanceAllocatorDto } from './platform-performance-allocator.service';

@Controller('platform-performance-allocator')
export class PlatformPerformanceAllocatorController {
  constructor(private readonly service: PlatformPerformanceAllocatorService) {}

  @Post()
  async create(@Body() dto: CreatePlatformPerformanceAllocatorDto) {
    return await this.service.create(dto);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return await this.service.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Get(':id/analyze')
  async analyze(@Param('id') id: string) {
    return await this.service.analyze(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updates: Partial<any>) {
    return await this.service.update(id, updates);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.service.delete(id);
    return { message: 'Platform performance allocator deleted successfully' };
  }
}
