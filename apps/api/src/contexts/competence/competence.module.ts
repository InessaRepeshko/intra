import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrgStructureModule } from '../org-structure/org-structure.module';
import { CompetenceService } from './application/services/competence.service';
import { CompetenceClusterService } from './application/services/competence-cluster.service';
import { CompetenceQuestionService } from './application/services/competence-question.service';
import { CompetenceRepository } from './infrastructure/prisma-repositories/competence.repository';
import { CompetenceClusterRepository } from './infrastructure/prisma-repositories/competence-cluster.repository';
import { CompetenceQuestionRepository } from './infrastructure/prisma-repositories/competence-question.repository';
import { CompetenceQuestionPositionRepository } from './infrastructure/prisma-repositories/competence-question-position.repository';
import {
  COMPETENCE_REPOSITORY,
  COMPETENCE_CLUSTER_REPOSITORY,
  COMPETENCE_QUESTION_REPOSITORY,
  COMPETENCE_QUESTION_POSITION_REPOSITORY,
} from './application/ports';
import { CompetencesController } from './presentation/http/controllers/competences.controller';
import { CompetenceClustersController } from './presentation/http/controllers/competence-clusters.controller';
import { CompetenceQuestionsController } from './presentation/http/controllers/competence-questions.controller';

@Module({
  imports: [DatabaseModule, OrgStructureModule],
  controllers: [CompetencesController, CompetenceClustersController, CompetenceQuestionsController],
  providers: [
    CompetenceService,
    CompetenceClusterService,
    CompetenceQuestionService,
    CompetenceRepository,
    CompetenceClusterRepository,
    CompetenceQuestionRepository,
    CompetenceQuestionPositionRepository,
    { provide: COMPETENCE_REPOSITORY, useExisting: CompetenceRepository },
    { provide: COMPETENCE_CLUSTER_REPOSITORY, useExisting: CompetenceClusterRepository },
    { provide: COMPETENCE_QUESTION_REPOSITORY, useExisting: CompetenceQuestionRepository },
    { provide: COMPETENCE_QUESTION_POSITION_REPOSITORY, useExisting: CompetenceQuestionPositionRepository },
  ],
  exports: [CompetenceService, CompetenceClusterService, CompetenceQuestionService],
})
export class CompetenceModule {}

