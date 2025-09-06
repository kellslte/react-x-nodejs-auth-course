import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import type { ApiResponse } from './shared/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      success: true,
      message: 'React Auth Course API - NestJS Application - Health Check',
      data: {
        status: 'healthy',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
