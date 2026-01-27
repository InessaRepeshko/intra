import {
    AddQuestionToReviewPayload,
    AddRespondentPayload,
    AddReviewerPayload,
    ClusterScoreSearchQuery,
    CreateAnswerPayload,
    CreateQuestionPayload,
    CreateReviewPayload,
    QuestionSearchQuery,
    RespondentCategory,
    RespondentSearchQuery,
    ReviewerSearchQuery,
    ReviewQuestionRelationSearchQuery,
    ReviewSearchQuery,
    ReviewStage,
    UpdateRespondentPayload,
    UpdateReviewPayload,
    UpsertClusterScorePayload,
} from '@intra/shared-kernel';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { AnswerDomain } from '../../domain/answer.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { QuestionDomain } from '../../domain/question.domain';
import { RespondentDomain } from '../../domain/respondent.domain';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewerDomain } from '../../domain/reviewer.domain';
import {
    ANSWER_REPOSITORY,
    AnswerRepositoryPort,
} from '../ports/answer.repository.port';
import {
    CLUSTER_SCORE_REPOSITORY,
    ClusterScoreRepositoryPort,
} from '../ports/cluster-score.repository.port';
import {
    QuestionRepositoryPort,
    QUESTION_REPOSITORY as REVIEW_QUESTION_REPOSITORY,
} from '../ports/question.repository.port';
import {
    RESPONDENT_REPOSITORY,
    RespondentRepositoryPort,
} from '../ports/respondent.repository.port';
import {
    REVIEW_QUESTION_RELATION_REPOSITORY,
    ReviewQuestionRelationRepositoryPort,
} from '../ports/review-question-relation.repository.port';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../ports/review.repository.port';
import {
    REVIEWER_REPOSITORY,
    ReviewerRepositoryPort,
} from '../ports/reviewer.repository.port';
import { CycleService } from './cycle.service';

@Injectable()
export class ReviewService {
    constructor(
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
        @Inject(REVIEW_QUESTION_REPOSITORY)
        private readonly questions: QuestionRepositoryPort,
        @Inject(REVIEW_QUESTION_RELATION_REPOSITORY)
        private readonly questionRelations: ReviewQuestionRelationRepositoryPort,
        @Inject(ANSWER_REPOSITORY)
        private readonly answers: AnswerRepositoryPort,
        @Inject(RESPONDENT_REPOSITORY)
        private readonly respondents: RespondentRepositoryPort,
        @Inject(REVIEWER_REPOSITORY)
        private readonly reviewers: ReviewerRepositoryPort,
        @Inject(CLUSTER_SCORE_REPOSITORY)
        private readonly clusterScores: ClusterScoreRepositoryPort,
        private readonly questionTemplates: QuestionTemplateService,
        private readonly competences: CompetenceService,
        private readonly cycles: CycleService,
    ) {}

    async create(payload: CreateReviewPayload): Promise<ReviewDomain> {
        if (payload.cycleId) {
            await this.cycles.getById(payload.cycleId);
        }

        const review = ReviewDomain.create({
            rateeId: payload.rateeId,
            rateeFullName: payload.rateeFullName,
            rateePositionId: payload.rateePositionId,
            rateePositionTitle: payload.rateePositionTitle,
            hrId: payload.hrId,
            hrFullName: payload.hrFullName,
            hrNote: payload.hrNote,
            teamId: payload.teamId ?? null,
            teamTitle: payload.teamTitle ?? null,
            managerId: payload.managerId ?? null,
            managerFullName: payload.managerFullName ?? null,
            managerPositionId: payload.managerPositionId ?? null,
            managerPositionTitle: payload.managerPositionTitle ?? null,
            cycleId: payload.cycleId ?? null,
            stage: payload.stage ?? ReviewStage.VERIFICATION_BY_HR,
            reportId: payload.reportId ?? null,
        });

        const created = await this.reviews.create(review);
        return this.getById(created.id!);
    }

    async search(query: ReviewSearchQuery): Promise<ReviewDomain[]> {
        return this.reviews.search(query);
    }

    async getById(id: number): Promise<ReviewDomain> {
        const review = await this.reviews.findById(id);
        if (!review) throw new NotFoundException('Review not found');
        return review;
    }

    async update(
        id: number,
        patch: UpdateReviewPayload,
    ): Promise<ReviewDomain> {
        await this.getById(id);

        if (patch.cycleId) {
            await this.cycles.getById(patch.cycleId);
        }

        const payload: UpdateReviewPayload = {
            ...(patch.rateeId !== undefined ? { rateeId: patch.rateeId } : {}),
            ...(patch.rateeFullName !== undefined
                ? { rateeFullName: patch.rateeFullName }
                : {}),
            ...(patch.rateePositionId !== undefined
                ? { rateePositionId: patch.rateePositionId }
                : {}),
            ...(patch.rateePositionTitle !== undefined
                ? { rateePositionTitle: patch.rateePositionTitle }
                : {}),
            ...(patch.hrId !== undefined ? { hrId: patch.hrId } : {}),
            ...(patch.hrFullName !== undefined
                ? { hrFullName: patch.hrFullName }
                : {}),
            ...(patch.hrNote !== undefined ? { hrNote: patch.hrNote } : {}),
            ...(patch.teamId !== undefined ? { teamId: patch.teamId } : {}),
            ...(patch.teamTitle !== undefined
                ? { teamTitle: patch.teamTitle }
                : {}),
            ...(patch.managerId !== undefined
                ? { managerId: patch.managerId }
                : {}),
            ...(patch.managerFullName !== undefined
                ? { managerFullName: patch.managerFullName }
                : {}),
            ...(patch.managerPositionId !== undefined
                ? { managerPositionId: patch.managerPositionId }
                : {}),
            ...(patch.managerPositionTitle !== undefined
                ? { managerPositionTitle: patch.managerPositionTitle }
                : {}),
            ...(patch.cycleId !== undefined ? { cycleId: patch.cycleId } : {}),
            ...(patch.stage !== undefined ? { stage: patch.stage } : {}),
            ...(patch.reportId !== undefined
                ? { reportId: patch.reportId }
                : {}),
        };

        await this.reviews.updateById(id, payload);
        return this.getById(id);
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.reviews.deleteById(id);
    }

    async createQuestion(
        payload: CreateQuestionPayload,
    ): Promise<QuestionDomain> {
        if (payload.cycleId) {
            await this.cycles.getById(payload.cycleId);
        }

        const baseQuestion = payload.questionTemplateId
            ? await this.questionTemplates.getById(payload.questionTemplateId)
            : null;

        const title = payload.title ?? baseQuestion?.title;
        const answerType = payload.answerType ?? baseQuestion?.answerType;

        if (!title || !answerType) {
            throw new NotFoundException(
                'Base question data is required to create review question',
            );
        }

        const question = QuestionDomain.create({
            cycleId: payload.cycleId ?? null,
            questionTemplateId: payload.questionTemplateId ?? null,
            title,
            answerType,
            competenceId:
                payload.competenceId ?? baseQuestion?.competenceId ?? null,
            isForSelfassessment:
                payload.isForSelfassessment ??
                baseQuestion?.isForSelfassessment ??
                false,
        });

        return this.questions.create(question);
    }

    async listQuestions(query: QuestionSearchQuery): Promise<QuestionDomain[]> {
        return this.questions.search(query);
    }

    async deleteQuestion(id: number): Promise<void> {
        await this.questions.deleteById(id);
    }

    async attachQuestion(
        payload: AddQuestionToReviewPayload,
    ): Promise<ReviewQuestionRelationDomain> {
        await this.getById(payload.reviewId);
        const question = await this.questionTemplates.getById(
            payload.questionId,
        );
        const competence = await this.competences.getById(
            question.competenceId,
        );

        const relation = ReviewQuestionRelationDomain.create({
            reviewId: payload.reviewId,
            questionId: question.id!,
            questionTitle: question.title,
            answerType: question.answerType,
            competenceId: question.competenceId,
            competenceTitle: competence.title,
            isForSelfassessment: question.isForSelfassessment,
        });

        return this.questionRelations.link(relation);
    }

    async listQuestionRelations(
        reviewId: number,
        query: ReviewQuestionRelationSearchQuery,
    ): Promise<ReviewQuestionRelationDomain[]> {
        await this.getById(reviewId);
        return this.questionRelations.listByReview(reviewId, query);
    }

    async detachQuestion(reviewId: number, questionId: number): Promise<void> {
        await this.getById(reviewId);
        await this.questionRelations.unlink(reviewId, questionId);
    }

    async addAnswer(payload: CreateAnswerPayload): Promise<AnswerDomain> {
        await this.getById(payload.reviewId);

        const answer = AnswerDomain.create({
            reviewId: payload.reviewId,
            questionId: payload.questionId,
            respondentCategory: payload.respondentCategory,
            answerType: payload.answerType,
            numericalValue: payload.numericalValue ?? null,
            textValue: payload.textValue ?? null,
        });

        return this.answers.create(answer);
    }

    async listAnswers(
        reviewId: number,
        respondentCategory?: RespondentCategory,
    ): Promise<AnswerDomain[]> {
        await this.getById(reviewId);
        return this.answers.list({ reviewId: reviewId, respondentCategory });
    }

    async addRespondent(
        payload: AddRespondentPayload,
    ): Promise<RespondentDomain> {
        await this.getById(payload.reviewId);

        const relation = RespondentDomain.create({
            reviewId: payload.reviewId,
            respondentId: payload.respondentId,
            fullName: payload.fullName,
            category: payload.category,
            responseStatus: payload.responseStatus,
            respondentNote: payload.respondentNote,
            hrNote: payload.hrNote,
            positionId: payload.positionId,
            positionTitle: payload.positionTitle,
            teamId: payload.teamId,
            teamTitle: payload.teamTitle,
            invitedAt: payload.invitedAt,
            canceledAt: payload.canceledAt,
            respondedAt: payload.respondedAt,
        });

        return this.respondents.create(relation);
    }

    async updateRespondent(
        id: number,
        patch: UpdateRespondentPayload,
    ): Promise<RespondentDomain> {
        return this.respondents.updateById(id, patch);
    }

    async listRespondents(
        reviewId: number,
        query: RespondentSearchQuery,
    ): Promise<RespondentDomain[]> {
        await this.getById(reviewId);
        return this.respondents.listByReview(reviewId, query);
    }

    async removeRespondent(id: number): Promise<void> {
        await this.respondents.deleteById(id);
    }

    async addReviewer(payload: AddReviewerPayload): Promise<ReviewerDomain> {
        await this.getById(payload.reviewId);
        const relation = ReviewerDomain.create({
            reviewId: payload.reviewId,
            reviewerId: payload.reviewerId,
            fullName: payload.fullName,
            positionId: payload.positionId,
            positionTitle: payload.positionTitle,
            teamId: payload.teamId,
            teamTitle: payload.teamTitle,
        });
        return this.reviewers.create(relation);
    }

    async listReviewers(
        reviewId: number,
        query: ReviewerSearchQuery,
    ): Promise<ReviewerDomain[]> {
        await this.getById(reviewId);
        return this.reviewers.listByReview(reviewId, query);
    }

    async removeReviewer(id: number): Promise<void> {
        await this.reviewers.deleteById(id);
    }

    async upsertClusterScore(
        payload: UpsertClusterScorePayload,
    ): Promise<ClusterScoreDomain> {
        if (payload.cycleId) {
            await this.cycles.getById(payload.cycleId);
        }

        const score = ClusterScoreDomain.create({
            cycleId: payload.cycleId ?? null,
            clusterId: payload.clusterId,
            rateeId: payload.rateeId,
            reviewId: payload.reviewId,
            score: payload.score,
            answersCount: payload.answersCount ?? 1,
        });

        return this.clusterScores.upsert(score);
    }

    async listClusterScores(
        query: ClusterScoreSearchQuery,
    ): Promise<ClusterScoreDomain[]> {
        return this.clusterScores.list(query);
    }

    async removeClusterScore(id: number): Promise<void> {
        await this.clusterScores.deleteById(id);
    }
}
