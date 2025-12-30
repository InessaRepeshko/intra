import { Module } from '@nestjs/common';
import { TeamsService } from './application/teams.service';
import { TeamsController } from './presentation/http/controllers/teams.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TeamsRepository } from './infrastructure/prisma-repositories/teams.repository';
import { UsersModule } from './users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
})
export class TeamsModule {}
