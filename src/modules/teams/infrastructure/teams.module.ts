import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { TeamsController } from './http/teams.controller';
import { TeamsApplicationService } from '../application/teams.application-service';
import { CreateTeamUseCase } from '../application/use-cases/create-team.usecase';
import { UpdateTeamUseCase } from '../application/use-cases/update-team.usecase';
import { PrismaTeamsRepository } from './persistence/prisma/prisma-teams.repository';
import { TEAMS_REPOSITORY } from '../domain/repositories/teams.repository.token';

@Module({
  imports: [DatabaseModule],
  controllers: [TeamsController],
  providers: [
    TeamsApplicationService,
    CreateTeamUseCase,
    UpdateTeamUseCase,
    PrismaTeamsRepository,
    {
      provide: TEAMS_REPOSITORY,
      useExisting: PrismaTeamsRepository,
    },
  ],
  exports: [TeamsApplicationService],
})
export class TeamsModule {}


