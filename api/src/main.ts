import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { TimeoutInterceptor } from './shared/interceptors/timeout.interceptor';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import express from 'express';
import { existsSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('RouterXApplication');

  // Get the underlying Express instance
  const expressApp = app.getHttpAdapter().getInstance();

  app.setGlobalPrefix('api/v1', {
    exclude: ['health', '/'],
  });

  app.enableCors({
    origin: configService.get<string>('app.frontendUrl') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  // Serve the frontend dist folder as static assets in production
  // if (configService.get<string>('NODE_ENV') === 'production') {
  //   const frontendDistPath = join(__dirname, '..', '..', 'web', 'dist');

  //   // Check if frontend build exists
  //   if (existsSync(frontendDistPath)) {
  //     logger.log(`📁 Serving static files from: ${frontendDistPath}`);

  //     // Serve static files with proper caching headers
  //     expressApp.use(express.static(frontendDistPath, {
  //       maxAge: '1y', // Cache static assets for 1 year
  //       etag: true,
  //       lastModified: true,
  //       setHeaders: (res, path) => {
  //         // Set different cache headers for different file types
  //         if (path.endsWith('.html')) {
  //           res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  //         } else if (path.endsWith('.js') || path.endsWith('.css')) {
  //           res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  //         } else if (path.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
  //           res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  //         }
  //       },
  //     }));

  //     // Fallback to index.html for SPA routing (catch-all route)
  //     expressApp.use((req, res, next) => {
  //       // Skip API routes
  //       if (req.originalUrl.startsWith('/api/')) {
  //         return next();
  //       }

  //       // Serve index.html for all other routes (SPA fallback)
  //       res.sendFile(join(frontendDistPath, 'index.html'));
  //     });
  //   } else {
  //     logger.warn(`⚠️  Frontend build not found at: ${frontendDistPath}`);
  //     logger.warn('Run "yarn build" to build the frontend before starting production server');
  //   }
  // } else {
  //   // In development, serve a simple message for the root route
  //   expressApp.get('/', (req, res) => {
  //     res.json({
  //       success: true,
  //       message: 'RouterX API is running in development mode',
  //       timestamp: new Date().toISOString(),
  //       frontend: 'Please run "yarn web:dev" to start the frontend development server'
  //     });
  //   });
  // }


  await app.listen(configService.getOrThrow<number>('PORT'), () => {
    logger.log(`✅ RouterX API is running on port ${configService.getOrThrow<number>('PORT')}`);
  });
}
bootstrap();
