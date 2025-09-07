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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('RouterXApplication');

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


  await app.listen(configService.getOrThrow<number>('PORT'), () => {
    logger.log(`✅ RouterX API is running on port ${configService.getOrThrow<number>('PORT')}`);
  });
}
bootstrap();
