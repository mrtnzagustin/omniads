import { Injectable } from '@nestjs/common';
import { DataSyncService } from './services/data-sync.service';

@Injectable()
export class AppService {
  constructor(private dataSyncService: DataSyncService) {}

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'OmniAds Backend',
      version: '1.0.0',
    };
  }

  async triggerDataSync() {
    try {
      await this.dataSyncService.fullSync();
      return {
        success: true,
        message: 'Data sync completed successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Data sync failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
