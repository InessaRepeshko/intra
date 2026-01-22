import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { CompetenceService } from './application/services/competence.service';
import { ClusterService } from './application/services/cluster.service';
import { QuestionTemplateService } from './application/services/question-template.service';
import { CompetenceRepository } from './infrastructure/prisma-repositories/competence.repository';
import { ClusterRepository } from './infrastructure/prisma-repositories/cluster.repository';
import { QuestionTemplateRepository } from './infrastructure/prisma-repositories/question-template.repository';
import { QuestionTemplatePositionRelationRepository } from './infrastructure/prisma-repositories/question-template-position-relation.repository';
import { COMPETENCE_REPOSITORY } from './application/ports/competence.repository.port';
import { CLUSTER_REPOSITORY } from './application/ports/cluster.repository.port';
import { QUESTION_TEMPLATE_REPOSITORY } from './application/ports/question-template.repository.port';
import { QUESTION_TEMPLATE_POSITION_RELATION_REPOSITORY } from './application/ports/question-template-position-relation.repository.port';
import { CompetencesController } from './presentation/http/controllers/competences.controller';
import { ClustersController } from './presentation/http/controllers/clusters.controller';
import { QuestionTemplatesController } from './presentation/http/controllers/questions.controller';

@Module({
  imports: [DatabaseModule, OrganisationModule],
  controllers: [CompetencesController, ClustersController, QuestionTemplatesController],
  providers: [
    CompetenceService,
    ClusterService,
    QuestionTemplateService,
    CompetenceRepository,
    ClusterRepository,
    QuestionTemplateRepository,
    QuestionTemplatePositionRelationRepository,
    { provide: COMPETENCE_REPOSITORY, useExisting: CompetenceRepository },
    { provide: CLUSTER_REPOSITORY, useExisting: ClusterRepository },
    { provide: QUESTION_TEMPLATE_REPOSITORY, useExisting: QuestionTemplateRepository },
    { provide: QUESTION_TEMPLATE_POSITION_RELATION_REPOSITORY, useExisting: QuestionTemplatePositionRelationRepository },
  ],
  exports: [CompetenceService, ClusterService, QuestionTemplateService],
})
export class LibraryModule { }

