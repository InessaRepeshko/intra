import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { DatabaseModule } from '../../database/database.module';
import { TeamsRepository } from './teams.repository';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository, UsersService],
})
export class TeamsModule {}
