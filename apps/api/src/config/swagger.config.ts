import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';
import { getAppName } from './app.config';
import { GLOBAL_PREFIX } from './constants';
import { FAVICON_PATH } from './constants';

export function setupSwagger(app: INestApplication): void {
    const appName = getAppName();
    const config = new DocumentBuilder()
        .setTitle(`${appName} API`)
        .setDescription(`API documentation for ${appName}`)
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(GLOBAL_PREFIX, app, document, {
        customSiteTitle: `${appName} API`,
        customfavIcon: FAVICON_PATH,
        swaggerOptions: {
            theme: 'dark',
            filter: true,
        },
        customCss:
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
}