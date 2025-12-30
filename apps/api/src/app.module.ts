import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/identity/users.module';
import { TeamsModule } from './modules/identity/teams.module';
import { Feedback360Module } from './modules/feedback360/feedback360.module';

@Module({
  imports: [UsersModule, Feedback360Module, TeamsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
