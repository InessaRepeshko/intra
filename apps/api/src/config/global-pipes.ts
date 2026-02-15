<<<<<<< HEAD
import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setupGlobalPipes(app: INestApplication): void {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            whitelist: true,
            forbidNonWhitelisted: false,
            validateCustomDecorators: false,
        }),
    );
}
=======
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

export function setupGlobalPipes(app: INestApplication): void {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            whitelist: true,
            forbidNonWhitelisted: false,
            validateCustomDecorators: true,
        }),
    );
}
>>>>>>> origin/main
