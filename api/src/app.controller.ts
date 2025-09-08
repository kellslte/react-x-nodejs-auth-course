import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

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
