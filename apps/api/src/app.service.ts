import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAppName } from './config/app.config';
import { APP_VERSION, GLOBAL_PREFIX } from './config/constants';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) { }

  getHomePageMsg(): string {
    const appName = this.configService.get<string>('app.name', getAppName());
    const appVersion = this.configService.get<string>('app.version', APP_VERSION);
    return `Welcome to ${appName} API v${appVersion}`;
  }

  getApiDocsLink(): string {
    const protocol = this.configService.get<string>('app.protocol', 'http');
    const host = this.configService.get<string>('app.host', 'localhost');
    const port = this.configService.get<number>('app.port', 8080);
    const globalPrefix = this.configService.get<string>('app.globalPrefix', GLOBAL_PREFIX);
    return `${protocol}://${host}:${port}/${globalPrefix}`;
  }
}
