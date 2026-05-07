import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app';
import databaseConfig from './config/database';
import mailConfig from './config/mail';
import { Feedback360Module } from './contexts/feedback360/feedback360.module';
import { IdentityModule } from './contexts/identity/identity.module';
import { LibraryModule } from './contexts/library/library.module';
import { NotificationsModule } from './contexts/notifications/notifications.module';
import { OrganisationModule } from './contexts/organisation/organisation.module';
import { ReportingModule } from './contexts/reporting/reporting.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig, mailConfig],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'apps', 'docs', 'public'),
            serveRoot: '/public',
        }),
        DatabaseModule,
        AuthModule,
        IdentityModule,
        OrganisationModule,
        LibraryModule,
        Feedback360Module,
        ReportingModule,
        NotificationsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
