import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrgStructureModule } from '../org-structure/org-structure.module';
import { CompetenceService } from './application/services/competence.service';
import { ClusterService } from './application/services/cluster.service';
import { QuestionService } from './application/services/question.service';
import { CompetenceRepository } from './infrastructure/prisma-repositories/competence.repository';
import { ClusterRepository } from './infrastructure/prisma-repositories/cluster.repository';
import { QuestionRepository } from './infrastructure/prisma-repositories/question.repository';
import { QuestionPositionRepository } from './infrastructure/prisma-repositories/question-position.repository';
import { COMPETENCE_REPOSITORY } from './application/ports/competence.repository.port';
import { CLUSTER_REPOSITORY } from './application/ports/cluster.repository.port';
import { QUESTION_REPOSITORY } from './application/ports/question.repository.port';
import { QUESTION_POSITION_REPOSITORY } from './application/ports/question-position.repository.port';
import { CompetencesController } from './presentation/http/controllers/competences.controller';
import { ClustersController } from './presentation/http/controllers/clusters.controller';
import { QuestionsController } from './presentation/http/controllers/questions.controller';

@Module({
  imports: [DatabaseModule, OrgStructureModule],
  controllers: [CompetencesController, ClustersController, QuestionsController],
  providers: [
    CompetenceService,
    ClusterService,
    QuestionService,
    CompetenceRepository,
    ClusterRepository,
    QuestionRepository,
    QuestionPositionRepository,
    { provide: COMPETENCE_REPOSITORY, useExisting: CompetenceRepository },
    { provide: CLUSTER_REPOSITORY, useExisting: ClusterRepository },
    { provide: QUESTION_REPOSITORY, useExisting: QuestionRepository },
    { provide: QUESTION_POSITION_REPOSITORY, useExisting: QuestionPositionRepository },
  ],
  exports: [CompetenceService, ClusterService, QuestionService],
})
export class LibraryModule { }

