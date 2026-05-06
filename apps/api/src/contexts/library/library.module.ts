import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { Feedback360Module } from '../feedback360/feedback360.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { CLUSTER_REPOSITORY } from './application/ports/cluster.repository.port';
import { COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY } from './application/ports/competence-question-template-relation.repository.port';
import { COMPETENCE_REPOSITORY } from './application/ports/competence.repository.port';
import { POSITION_COMPETENCE_RELATION_REPOSITORY } from './application/ports/position-competence-relation.repository.port';
import { POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY } from './application/ports/position-question-template-relation.repository.port';
import { QUESTION_TEMPLATE_REPOSITORY } from './application/ports/question-template.repository.port';
import { ClusterService } from './application/services/cluster.service';
import { CompetenceService } from './application/services/competence.service';
import { QuestionTemplateService } from './application/services/question-template.service';
import { ClusterRepository } from './infrastructure/prisma-repositories/cluster.repository';
import { CompetenceQuestionTemplateRelationRepository } from './infrastructure/prisma-repositories/competence-question-template-relation.repository';
import { CompetenceRepository } from './infrastructure/prisma-repositories/competence.repository';
import { PositionCompetenceRelationRepository } from './infrastructure/prisma-repositories/position-competence-relation.repository';
import { PositionQuestionTemplateRelationRepository } from './infrastructure/prisma-repositories/position-question-template-relation.repository';
import { QuestionTemplateRepository } from './infrastructure/prisma-repositories/question-template.repository';
import { ClustersController } from './presentation/http/controllers/clusters.controller';
import { CompetencesController } from './presentation/http/controllers/competences.controller';
import { QuestionTemplatesController } from './presentation/http/controllers/question-templates.controller';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        OrganisationModule,
        forwardRef(() => Feedback360Module),
    ],
    controllers: [
        CompetencesController,
        ClustersController,
        QuestionTemplatesController,
    ],
    providers: [
        CompetenceService,
        ClusterService,
        QuestionTemplateService,
        CompetenceRepository,
        ClusterRepository,
        QuestionTemplateRepository,
        PositionQuestionTemplateRelationRepository,
        PositionCompetenceRelationRepository,
        CompetenceQuestionTemplateRelationRepository,
        { provide: COMPETENCE_REPOSITORY, useExisting: CompetenceRepository },
        { provide: CLUSTER_REPOSITORY, useExisting: ClusterRepository },
        {
            provide: QUESTION_TEMPLATE_REPOSITORY,
            useExisting: QuestionTemplateRepository,
        },
        {
            provide: POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY,
            useExisting: PositionQuestionTemplateRelationRepository,
        },
        {
            provide: POSITION_COMPETENCE_RELATION_REPOSITORY,
            useExisting: PositionCompetenceRelationRepository,
        },
        {
            provide: COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY,
            useExisting: CompetenceQuestionTemplateRelationRepository,
        },
    ],
    exports: [CompetenceService, ClusterService, QuestionTemplateService],
})
export class LibraryModule {}
