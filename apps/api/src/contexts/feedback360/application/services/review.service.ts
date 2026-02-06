import {
    AddQuestionToReviewPayload,
    AddRespondentPayload,
    AddReviewerPayload,
    ClusterScoreSearchQuery,
    CreateAnswerPayload,
    CreateQuestionPayload,
    CreateReviewPayload,
    CycleStage,
    QuestionSearchQuery,
    RespondentCategory,
    RespondentSearchQuery,
    ResponseStatus,
    ReviewerSearchQuery,
    ReviewQuestionRelationSearchQuery,
    ReviewSearchQuery,
    ReviewStage,
    UpdateRespondentPayload,
    UpdateReviewPayload,
    UpsertClusterScorePayload,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { PrismaService } from 'src/database/prisma.service';
import { AnswerDomain } from '../../domain/answer.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { QuestionDomain } from '../../domain/question.domain';
import { RespondentDomain } from '../../domain/respondent.domain';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { ReviewStageHistoryDomain } from '../../domain/review-stage-history.domain';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewerDomain } from '../../domain/reviewer.domain';
import {
    REVIEW_STAGE_TRANSITIONS,
    SYSTEM_ACTOR_ID,
    TRANSITION_REASONS,
} from '../constants/review-stage-transitions';
import { ReviewStageChangedEvent } from '../events/review-stage-changed.event';
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
    REVIEW_STAGE_HISTORY_REPOSITORY,
    ReviewStageHistoryRepositoryPort,
} from '../ports/review-stage-history.repository.port';
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
        @Inject(REVIEW_STAGE_HISTORY_REPOSITORY)
        private readonly stageHistory: ReviewStageHistoryRepositoryPort,
        private readonly prisma: PrismaService,
        private readonly questionTemplates: QuestionTemplateService,
        private readonly competences: CompetenceService,
        private readonly cycles: CycleService,
        private readonly eventEmitter: EventEmitter2,
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
        const updated = await this.respondents.updateById(id, patch);

        // Reactive Trigger: Check if all responses completed
        if (
            patch.responseStatus === ResponseStatus.COMPLETED ||
            patch.responseStatus === ResponseStatus.CANCELED
        ) {
            await this.checkReviewCompletion(updated.reviewId);

            const review = await this.getById(updated.reviewId);
            if (review.cycleId) {
                await this.checkCompletion(review.cycleId);
            }
        }

        return updated;
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

    /**
     * Centralized method for stage transitions with validation and history tracking
     * @param reviewId ID of the review
     * @param nextStage Target stage
     * @param actorId User ID who initiated the change (0 for system)
     * @param actorName Full name of the actor
     * @param reason Optional reason for the transition
     */
    async changeStage(
        reviewId: number,
        nextStage: ReviewStage,
        actorId: number = SYSTEM_ACTOR_ID,
        actorName: string | null = 'System',
        reason?: string,
    ): Promise<void> {
        const review = await this.getById(reviewId);
        const currentStage = review.stage;

        // Validate transition is allowed
        const allowedTransitions = REVIEW_STAGE_TRANSITIONS[currentStage];
        if (!allowedTransitions.includes(nextStage)) {
            throw new BadRequestException(
                `Invalid stage transition from ${currentStage} to ${nextStage}`,
            );
        }

        // Perform update and history logging in a transaction
        await this.prisma.$transaction(async (tx) => {
            // Update review stage
            await tx.review.update({
                where: { id: reviewId },
                data: { stage: nextStage },
            });

            // Create history record
            const history = ReviewStageHistoryDomain.create({
                reviewId,
                fromStage: currentStage,
                toStage: nextStage,
                changedById: actorId || null,
                changedByName: actorName,
                reason,
            });

            await this.stageHistory.create(history);
        });

        // Emit event for other modules to react
        this.eventEmitter.emit(
            'review.stage.changed',
            new ReviewStageChangedEvent(
                reviewId,
                currentStage,
                nextStage,
                actorId,
                actorName,
                reason,
            ),
        );
    }

    /**
     * Get stage change history for a review
     */
    async getStageHistory(
        reviewId: number,
    ): Promise<ReviewStageHistoryDomain[]> {
        return this.stageHistory.findByReviewId(reviewId);
    }

    /**
     * REACTIVE TRIGGER: Check if all respondents completed their responses
     * If yes, automatically transition to PREPARING_REPORT
     */
    async checkReviewCompletion(reviewId: number): Promise<void> {
        const review = await this.getById(reviewId);

        // Only check if review is currently in progress
        if (review.stage !== ReviewStage.IN_PROGRESS) {
            return;
        }

        // Get all respondents for this review
        const respondents = await this.respondents.listByReview(reviewId, {});

        // Check if there are any pending or in-progress respondents
        const hasPendingResponses = respondents.some(
            (r) =>
                r.responseStatus === ResponseStatus.PENDING ||
                r.responseStatus === ResponseStatus.IN_PROGRESS,
        );

        // If no pending responses, trigger report generation
        if (!hasPendingResponses && respondents.length > 0) {
            await this.changeStage(
                reviewId,
                ReviewStage.PREPARING_REPORT,
                SYSTEM_ACTOR_ID,
                'System',
                TRANSITION_REASONS.ALL_RESPONSES_COLLECTED,
            );
        }
    }

    /**
     * REACTIVE TRIGGER: Check if all respondents in cycle completed
     * If yes, automatically finish the cycle
     */
    async checkCompletion(cycleId: number): Promise<void> {
        const cycle = await this.cycles.getById(cycleId);

        if (cycle.stage !== CycleStage.ACTIVE) {
            return;
        }

        const reviews = await this.search({ cycleId });
        if (!reviews.length) {
            return;
        }

        let totalRespondents = 0;

        for (const review of reviews) {
            const respondents = await this.respondents.listByReview(
                review.id!,
                {},
            );
            totalRespondents += respondents.length;

            const hasPendingResponses = respondents.some(
                (r) =>
                    r.responseStatus === ResponseStatus.PENDING ||
                    r.responseStatus === ResponseStatus.IN_PROGRESS,
            );

            if (hasPendingResponses) {
                return;
            }
        }

        if (totalRespondents === 0) {
            return;
        }

        await this.cycles.finish(cycleId);
    }

    /**
     * MANUAL TRIGGER: HR force-completes a review
     * Transitions review to PREPARING_REPORT regardless of pending responses
     */
    async forceCompleteReview(
        reviewId: number,
        actorId: number,
        actorName: string,
    ): Promise<void> {
        await this.changeStage(
            reviewId,
            ReviewStage.PREPARING_REPORT,
            actorId,
            actorName,
            TRANSITION_REASONS.HR_FORCE_COMPLETION,
        );
    }
}
