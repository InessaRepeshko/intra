import { Module } from '@nestjs/common';
import { Feedback360Service } from './application/feedback360.service';
import { Feedback360CyclesService } from './application/feedback360-cycles.service';
import { Feedback360RespondentRelationsService } from './application/feedback360-respondent-relations.service';
import { Feedback360Controller } from './presentation/http/controllers/feedback360.controller';
import { Feedback360CyclesController } from './presentation/http/controllers/feedback360-cycles.controller';
import { Feedback360RespondentRelationsController } from './presentation/http/controllers/feedback360-respondent-relations.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { FEEDBACK360_REPOSITORY } from './application/repository-ports/feedback360.repository.port';
import { FEEDBACK360_CYCLE_REPOSITORY } from './application/repository-ports/feedback360-cycle.repository.port';
import { FEEDBACK360_RESPONDENT_RELATION_REPOSITORY } from './application/repository-ports/feedback360-respondent-relation.repository.port';
import { Feedback360PrismaRepository } from './infrastructure/prisma-repositories/feedback360.prisma.repository';
import { Feedback360CyclePrismaRepository } from './infrastructure/prisma-repositories/feedback360-cycle.prisma.repository';
import { Feedback360RespondentRelationPrismaRepository } from './infrastructure/prisma-repositories/feedback360-respondent-relation.prisma.repository';
import { IDENTITY_READ } from './application/external-ports/identity-read.port';
import { IdentityReadPrismaAdapter } from './infrastructure/prisma-repositories/identity-read.prisma.adapter';

@Module({
  imports: [PrismaModule],
  controllers: [Feedback360Controller, Feedback360CyclesController, Feedback360RespondentRelationsController],
  providers: [
    Feedback360Service,
    Feedback360PrismaRepository,
    { provide: FEEDBACK360_REPOSITORY, useExisting: Feedback360PrismaRepository },

    Feedback360CyclesService,
    Feedback360CyclePrismaRepository,
    { provide: FEEDBACK360_CYCLE_REPOSITORY, useExisting: Feedback360CyclePrismaRepository },

    Feedback360RespondentRelationsService,
    Feedback360RespondentRelationPrismaRepository,
    { provide: FEEDBACK360_RESPONDENT_RELATION_REPOSITORY, useExisting: Feedback360RespondentRelationPrismaRepository },

    IdentityReadPrismaAdapter,
    { provide: IDENTITY_READ, useExisting: IdentityReadPrismaAdapter },
  ],
})
export class Feedback360Module {}
