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

    app.enableShutdownHooks();
    setupGlobalPipes(app);
    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    setupSwagger(app);

    await setupServer(app, configService);
}

bootstrap();
