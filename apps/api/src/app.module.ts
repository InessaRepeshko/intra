import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/identity/users.module';
import { TeamsModule } from './modules/identity/teams.module';
import { PositionsModule } from './modules/identity/positions.module';
import { Feedback360Module } from './modules/feedback360/feedback360.module';
import { IdentityContextModule } from './contexts/identity/identity-context.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.app.config';
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
    UsersModule,
    Feedback360Module,
    TeamsModule,
    PositionsModule,
    IdentityContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
