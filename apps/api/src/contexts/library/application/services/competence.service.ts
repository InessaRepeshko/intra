import {
    CompetenceSearchQuery,
    CreateCompetencePayload,
    UpdateCompetencePayload,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { CompetenceDomain } from '../../domain/competence.domain';
import {
    COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY,
    CompetenceQuestionTemplateRelationRepositoryPort,
} from '../ports/competence-question-template-relation.repository.port';
import {
    COMPETENCE_REPOSITORY,
    CompetenceRepositoryPort,
} from '../ports/competence.repository.port';
import {
    POSITION_COMPETENCE_RELATION_REPOSITORY,
    PositionCompetenceRelationRepositoryPort,
} from '../ports/position-competence-relation.repository.port';
import {
    QUESTION_TEMPLATE_REPOSITORY,
    QuestionTemplateRepositoryPort,
} from '../ports/question-template.repository.port';

@Injectable()
export class CompetenceService {
    constructor(
        @Inject(COMPETENCE_REPOSITORY)
        private readonly competences: CompetenceRepositoryPort,
        @Inject(QUESTION_TEMPLATE_REPOSITORY)
        private readonly questionTemplates: QuestionTemplateRepositoryPort,
        @Inject(POSITION_COMPETENCE_RELATION_REPOSITORY)
        private readonly positionCompetenceRelations: PositionCompetenceRelationRepositoryPort,
        @Inject(COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY)
        private readonly competenceQuestionTemplateRelations: CompetenceQuestionTemplateRelationRepositoryPort,
        private readonly positions: PositionService,
    ) {}

    async create(payload: CreateCompetencePayload): Promise<CompetenceDomain> {
        const competence = CompetenceDomain.create({
            code: payload.code ?? null,
            title: payload.title,
            description: payload.description ?? null,
        });
        return this.competences.create(competence);
    }

    async search(query: CompetenceSearchQuery): Promise<CompetenceDomain[]> {
        return this.competences.search(query);
    }

    async getById(id: number): Promise<CompetenceDomain> {
        const competence = await this.competences.findById(id);
        if (!competence) throw new NotFoundException('Competence not found');
        return competence;
    }

    async update(
        id: number,
        patch: UpdateCompetencePayload,
    ): Promise<CompetenceDomain> {
        await this.getById(id);
        const payload: UpdateCompetencePayload = {
            ...(patch.code !== undefined ? { code: patch.code } : {}),
            ...(patch.title !== undefined ? { title: patch.title } : {}),
            ...(patch.description !== undefined
                ? { description: patch.description }
                : {}),
        };
        return this.competences.updateById(id, payload);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        const relatedQuestionTemplates = await this.listQuestionTemplates(id);
        const relatedPositions = await this.listPositions(id);
        if (
            relatedQuestionTemplates.length > 0 ||
            relatedPositions.length > 0
        ) {
            throw new BadRequestException(
                'Competence #' +
                    id +
                    ' cannot be deleted. It has ' +
                    relatedQuestionTemplates.length +
                    ' question templates and ' +
                    relatedPositions.length +
                    ' positions assigned to it.',
            );
        }
        await this.positionCompetenceRelations.deleteAllForCompetence(id);
        await this.competenceQuestionTemplateRelations.deleteAllForCompetence(
            id,
        );
        await this.competences.deleteById(id);
    }

    async attachPosition(
        competenceId: number,
        positionId: number,
    ): Promise<number[]> {
        await this.getById(competenceId);
        await this.positions.getById(positionId);

        await this.positionCompetenceRelations.link(competenceId, positionId);
        return this.listPositions(competenceId);
    }

    async detachPosition(
        competenceId: number,
        positionId: number,
    ): Promise<void> {
        await this.getById(competenceId);
        await this.positionCompetenceRelations.unlink(competenceId, positionId);
    }

    async listPositions(competenceId: number): Promise<number[]> {
        await this.getById(competenceId);
        const relations =
            await this.positionCompetenceRelations.listByCompetence(
                competenceId,
            );
        return relations.map((r) => r.positionId);
    }

    async attachQuestionTemplate(
        competenceId: number,
        questionTemplateId: number,
    ): Promise<number[]> {
        await this.getById(competenceId);
        await this.ensureQuestionTemplateExists(questionTemplateId);

        await this.competenceQuestionTemplateRelations.link(
            competenceId,
            questionTemplateId,
        );
        return this.listQuestionTemplates(competenceId);
    }

    async detachQuestionTemplate(
        competenceId: number,
        questionTemplateId: number,
    ): Promise<void> {
        await this.getById(competenceId);
        await this.competenceQuestionTemplateRelations.unlink(
            competenceId,
            questionTemplateId,
        );
    }

    async listQuestionTemplates(competenceId: number): Promise<number[]> {
        await this.getById(competenceId);
        const relations =
            await this.competenceQuestionTemplateRelations.listByCompetence(
                competenceId,
            );
        return relations.map((r) => r.questionTemplateId);
    }

    private async ensureQuestionTemplateExists(
        questionTemplateId: number,
    ): Promise<void> {
        const found = await this.questionTemplates.findById(questionTemplateId);
        if (!found) throw new NotFoundException('Question template not found');
    }
}
