import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PositionService } from 'src/contexts/organisation/application/services/position.service';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';
import {
    COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY,
    CompetenceQuestionTemplateRelationRepositoryPort,
} from '../ports/competence-question-template-relation.repository.port';
import {
    POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY,
    PositionQuestionTemplateRelationRepositoryPort,
} from '../ports/position-question-template-relation.repository.port';
import {
    QUESTION_TEMPLATE_REPOSITORY,
    QuestionTemplateRepositoryPort,
    QuestionTemplateSearchQuery,
    QuestionTemplateUpdatePayload,
} from '../ports/question-template.repository.port';
import { CompetenceService } from './competence.service';

export type CreateQuestionTemplateCommand = {
    competenceId: number;
    title: string;
    answerType: AnswerType;
    isForSelfassessment?: boolean;
    status?: QuestionTemplateStatus;
    positionIds?: number[];
};

export type UpdateQuestionTemplateCommand =
    Partial<CreateQuestionTemplateCommand>;

@Injectable()
export class QuestionTemplateService {
    constructor(
        @Inject(QUESTION_TEMPLATE_REPOSITORY)
        private readonly questionTemplates: QuestionTemplateRepositoryPort,
        @Inject(POSITION_QUESTION_TEMPLATE_RELATION_REPOSITORY)
        private readonly positionQuestionTemplateRelations: PositionQuestionTemplateRelationRepositoryPort,
        @Inject(COMPETENCE_QUESTION_TEMPLATE_RELATION_REPOSITORY)
        private readonly competenceQuestionTemplateRelations: CompetenceQuestionTemplateRelationRepositoryPort,
        private readonly competences: CompetenceService,
        private readonly positions: PositionService,
    ) {}

    async create(
        command: CreateQuestionTemplateCommand,
    ): Promise<QuestionTemplateDomain> {
        await this.competences.getById(command.competenceId);

        const question = QuestionTemplateDomain.create({
            competenceId: command.competenceId,
            title: command.title,
            answerType: command.answerType,
            isForSelfassessment: command.isForSelfassessment ?? false,
            status: command.status ?? QuestionTemplateStatus.ACTIVE,
            positionIds: command.positionIds ?? [],
        });

        const created = await this.questionTemplates.create(question);

        const positionIds = command.positionIds
            ? Array.from(new Set(command.positionIds))
            : [];
        if (positionIds.length) {
            await this.ensurePositionsExist(positionIds);
            await this.positionQuestionTemplateRelations.replace(
                created.id!,
                positionIds,
            );
        }

        return this.getById(created.id!);
    }

    async search(
        query: QuestionTemplateSearchQuery,
    ): Promise<QuestionTemplateDomain[]> {
        return this.questionTemplates.search(query);
    }

    async getById(id: number): Promise<QuestionTemplateDomain> {
        const question = await this.questionTemplates.findById(id);
        if (!question)
            throw new NotFoundException('Question template not found');
        return question;
    }

    async update(
        id: number,
        patch: UpdateQuestionTemplateCommand,
    ): Promise<QuestionTemplateDomain> {
        const current = await this.getById(id);

        if (patch.competenceId && patch.competenceId !== current.competenceId) {
            await this.competences.getById(patch.competenceId);
        }

        const payload: QuestionTemplateUpdatePayload = {
            ...(patch.competenceId !== undefined
                ? { competenceId: patch.competenceId }
                : {}),
            ...(patch.title !== undefined ? { title: patch.title } : {}),
            ...(patch.answerType !== undefined
                ? { answerType: patch.answerType }
                : {}),
            ...(patch.isForSelfassessment !== undefined
                ? { isForSelfassessment: patch.isForSelfassessment }
                : {}),
            ...(patch.status !== undefined ? { status: patch.status } : {}),
            ...(patch.positionIds !== undefined
                ? { positionIds: patch.positionIds }
                : {}),
        };

        await this.questionTemplates.updateById(id, payload);

        if (patch.positionIds) {
            const uniquePositions = Array.from(new Set(patch.positionIds));
            await this.ensurePositionsExist(uniquePositions);
            await this.positionQuestionTemplateRelations.replace(
                id,
                uniquePositions,
            );
        }

        return this.getById(id);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.questionTemplates.deleteById(id);
    }

    async attachPosition(
        questionId: number,
        positionId: number,
    ): Promise<QuestionTemplateDomain> {
        await this.getById(questionId);
        await this.positions.getById(positionId);

        await this.positionQuestionTemplateRelations.link(
            questionId,
            positionId,
        );
        return this.getById(questionId);
    }

    async detachPosition(
        questionId: number,
        positionId: number,
    ): Promise<void> {
        await this.getById(questionId);
        await this.positionQuestionTemplateRelations.unlink(
            questionId,
            positionId,
        );
    }

    async listPositions(questionId: number): Promise<number[]> {
        await this.getById(questionId);
        const relations =
            await this.positionQuestionTemplateRelations.listByQuestion(
                questionId,
            );
        return relations.map((r) => r.positionId);
    }

    async attachCompetence(
        questionId: number,
        competenceId: number,
    ): Promise<number[]> {
        await this.getById(questionId);
        await this.competences.getById(competenceId);

        await this.competenceQuestionTemplateRelations.link(
            competenceId,
            questionId,
        );
        return this.listCompetences(questionId);
    }

    async detachCompetence(
        questionId: number,
        competenceId: number,
    ): Promise<void> {
        await this.getById(questionId);
        await this.competenceQuestionTemplateRelations.unlink(
            competenceId,
            questionId,
        );
    }

    async listCompetences(questionId: number): Promise<number[]> {
        await this.getById(questionId);
        const relations =
            await this.competenceQuestionTemplateRelations.listByQuestionTemplate(
                questionId,
            );
        return relations.map((r) => r.competenceId);
    }

    private async ensurePositionsExist(positionIds: number[]): Promise<void> {
        await Promise.all(positionIds.map((id) => this.positions.getById(id)));
    }
}
