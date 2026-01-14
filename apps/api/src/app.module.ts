import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './contexts/identity/identity.module';
import { OrgStructureModule } from './contexts/org-structure/org-structure.module';
import appConfig from './config/app';
import databaseConfig from './config/database';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'apps', 'docs', 'public'),
      serveRoot: '/public',
    }),
    IdentityModule,
    OrgStructureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
