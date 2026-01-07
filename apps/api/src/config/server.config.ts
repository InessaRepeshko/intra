import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export async function setupServer(app: INestApplication, configService: ConfigService): Promise<void> {
    const port = configService.getOrThrow<number>('app.port');
    await app.listen(port);

    const appUrl = `${configService.getOrThrow<string>('app.protocol')}://${configService.getOrThrow<string>('app.host')}:${port}`;
    const globalPrefix = configService.getOrThrow<string>('app.globalPrefix');
    const docsUrl = `${appUrl}/${globalPrefix}`;

    console.log(`\n✔ Application is running on: ${appUrl}`);
    console.log(`\n✔ API Docs is available on: ${docsUrl}\n`);
}