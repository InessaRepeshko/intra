import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFile, readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Intra API')
    .setDescription('API documentation for Intra system')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Intra API',
    swaggerOptions: {
      theme: 'dark',
      filter: true,
    },
    customCss: 
  //   `
  //   html, body {
  //     background-color: #020617 !important;
  //   }

  //   .swagger-ui {
  //     background-color: transparent;
  //   }
  // ` + 
  readFileSync(
      join(
        process.cwd(), 
        'node_modules', 
        'swagger-ui-themes', 
        'themes', 
        '3.x', 
        'theme-outline.css'
      ),
      'utf8'
    ),
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
