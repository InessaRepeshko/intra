import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupGlobalPipes } from './config/global-pipes';
import { setupSwagger } from './config/swagger';
import { setupServer } from './config/server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  setupGlobalPipes(app);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  setupSwagger(app);

  await setupServer(app, configService);
}

bootstrap();
