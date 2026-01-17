import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './contexts/identity/identity.module';
import { OrganisationModule } from './contexts/organisation/organisation.module';
import { LibraryModule } from './contexts/library/library.module';
import appConfig from './config/app';
import databaseConfig from './config/database';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './database/database.module';

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
    DatabaseModule,
    IdentityModule,
    OrganisationModule,
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
