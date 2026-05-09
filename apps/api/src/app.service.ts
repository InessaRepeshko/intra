import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getApiVersion, getAppName } from './config/app';
import { DOCUMENTATION_PREFIX } from './config/constants';

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}

    getHomePageMsg(): string {
        const appName = this.configService.get<string>(
            'app.name',
            getAppName(),
        );
        const appVersion = this.configService.get<string>(
            'app.version',
            getApiVersion(),
        );
        return `Welcome to ${appName} API v${appVersion}`;
    }

    getApiDocsLink(): string {
        const protocol = this.configService.get<string>('app.protocol', 'http');
        const host = this.configService.get<string>('app.host', 'localhost');
        const port = this.configService.get<number>('app.port', 8080);
        const isProduction =
            this.configService.get<string>('app.node.env') === 'production' ||
            process.env.NODE_ENV === 'production';
        const globalPrefix = this.configService.get<string>(
            'app.globalPrefix',
            DOCUMENTATION_PREFIX,
        );
        return isProduction
            ? `${protocol}://${host}/${globalPrefix}`
            : `${protocol}://${host}:${port}/${globalPrefix}`;
    }
}
