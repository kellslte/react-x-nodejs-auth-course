import { Controller, Get, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { join } from 'path';

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

  @Get('.well-known/appspecific/com.chrome.devtools.json')
  getChromeDevToolsConfig() {
    // Return an empty object to satisfy Chrome DevTools
    // This prevents the "Cannot GET" error
    return {};
  }

  @Get('*')
  serveSPA(@Res() res: Response, @Req() req: Request) {
    // Only handle non-API routes for SPA fallback
    if (req.originalUrl.startsWith('/api/') || req.originalUrl.startsWith('/.well-known/')) {
      return res.status(404).send();
    }

    // Serve index.html for SPA routing
    res.sendFile(join(process.cwd(), 'web', 'dist', 'index.html'));
  }
}
