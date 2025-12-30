import { Module } from '@nestjs/common';
import { TeamsService } from './application/teams.service';
import { TeamsController } from './presentation/http/controllers/teams.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TEAM_REPOSITORY } from './application/repository-ports/team.repository.port';
import { TeamPrismaRepository } from './infrastructure/prisma-repositories/team.prisma.repository';
import { USER_REPOSITORY } from './application/repository-ports/user.repository.port';
import { UserPrismaRepository } from './infrastructure/prisma-repositories/user.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TeamsController],
  providers: [
    TeamsService,
    TeamPrismaRepository,
    { provide: TEAM_REPOSITORY, useExisting: TeamPrismaRepository },

    // Важливо: TeamsService залежить від UserRepositoryPort через токен,
    // тож TeamsModule сам "підв'язує" його до інфраструктурної реалізації
    // без імпорту UsersModule.
    UserPrismaRepository,
    { provide: USER_REPOSITORY, useExisting: UserPrismaRepository },
  ],
})
export class TeamsModule {}
