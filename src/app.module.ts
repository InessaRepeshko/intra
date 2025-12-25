import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './models/users/users.module';
import { Feedback360Module } from './models/feedback360/feedback360.module';
import { TeamsModule } from './models/teams/teams.module';

@Module({
  imports: [UsersModule, Feedback360Module, TeamsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
