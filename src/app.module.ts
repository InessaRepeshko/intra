import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/infrastructure/users.module';
import { Feedback360Module } from './modules/feedback360/infrastructure/feedback360.module';
import { TeamsModule } from './modules/teams/infrastructure/teams.module';

@Module({
  imports: [UsersModule, Feedback360Module, TeamsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
