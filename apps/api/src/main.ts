<<<<<<< HEAD
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGlobalPipes } from './config/global-pipes';
import { setupServer } from './config/server';
import { setupSwagger } from './config/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS with credentials support for cookie-based authentication
    app.enableCors({
        origin: true, // In production, specify exact frontend URL
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['set-cookie'],
    });

    app.enableShutdownHooks();
    setupGlobalPipes(app);
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    setupSwagger(app);

    await setupServer(app, configService);
}

bootstrap();
=======
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
>>>>>>> origin/main
