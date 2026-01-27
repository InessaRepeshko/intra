import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getApiVersion, getAppName } from './app';
import { DOCUMENTATION_PREFIX, FAVICON_PATH, OPENAPI_PATH } from './constants';

export function setupSwagger(app: INestApplication): void {
    const appName = getAppName();
    const config = new DocumentBuilder()
        .setTitle(`${appName} API`)
        .setDescription(`API documentation for ${appName}`)
        .setVersion(getApiVersion())
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup(DOCUMENTATION_PREFIX, app, document, {
        customSiteTitle: `${appName} API`,
        customfavIcon: FAVICON_PATH,
        swaggerOptions: {
            theme: 'dark',
            filter: true,
        },
        customCss: readFileSync(
            join(
                process.cwd(),
                '..',
                '..',
                'node_modules',
                'swagger-ui-themes',
                'themes',
                '3.x',
                'theme-outline.css',
            ),
            'utf8',
        ),
    });

    writeFileSync(OPENAPI_PATH, JSON.stringify(document, null, 2));
}
