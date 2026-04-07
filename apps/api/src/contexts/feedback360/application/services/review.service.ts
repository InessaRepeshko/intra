import {
    AddQuestionToReviewPayload,
    AddRespondentPayload,
    AddReviewerPayload,
    ClusterScoreSearchQuery,
    CreateAnswerPayload,
    CreateQuestionPayload,
    CreateReviewPayload,
    CycleStage,
    IdentityRole,
    QuestionSearchQuery,
    RespondentCategory,
    RespondentSearchQuery,
    ResponseStatus,
    ReviewerSearchQuery,
    ReviewQuestionRelationSearchQuery,
    ReviewSearchQuery,
    ReviewStage,
    SYSTEM_ACTOR,
    UpdateRespondentPayload,
    UpdateReviewPayload,
    UpsertClusterScorePayload,
} from '@intra/shared-kernel';
import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { CompetenceService } from 'src/contexts/library/application/services/competence.service';
import { QuestionTemplateService } from 'src/contexts/library/application/services/question-template.service';
import { PrismaService } from 'src/database/prisma.service';
import { AnswerDomain } from '../../domain/answer.domain';
import { ClusterScoreWithRelationsDomain } from '../../domain/cluster-score-with-relations.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { QuestionDomain } from '../../domain/question.domain';
import { RespondentDomain } from '../../domain/respondent.domain';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { ReviewStageHistoryDomain } from '../../domain/review-stage-history.domain';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewerDomain } from '../../domain/reviewer.domain';
import {
    RESPONSE_STATUS_TRANSITIONS,
    TRANSITION_REASONS as RESPONSE_TRANSITION_REASONS,
} from '../constants/response-status-transitions';
import {
    REVIEW_STAGE_TRANSITIONS,
    TRANSITION_REASONS as REVIEW_TRANSITION_REASONS,
} from '../constants/review-stage-transitions';
import { RespondentStatusChangedEvent } from '../events/respondent-status-changed.event';
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
            stage: payload.stage ?? ReviewStage.NEW,
            reportId: payload.reportId ?? null,
        });

        const created = await this.reviews.create(review);
        return this.getById(created.id!);
    }

    async search(query: ReviewSearchQuery): Promise<ReviewDomain[]> {
        return this.reviews.search(query);
    }

    async getById(id: number, actor?: UserDomain): Promise<ReviewDomain> {
        const review = await this.reviews.findById(id);
        if (!review)
            throw new NotFoundException('Review with id ' + id + ' not found');

        await this.checkAccessToReview(review, actor);

        return review;
    }

    /**
     * Checks if the actor has access to the review answers
     * as an admin, HR, manager, ratee, or reviewer.
     * @param review The review to check access for.
     * @param actor The actor to check access for.
     */
    private async checkAccessToReviewAnswers(
        review: ReviewDomain,
        actor?: UserDomain,
    ): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (isAdminOrHr) return;

        const isManagerOfReview = review.managerId === actor.id;
        const isRateeOfReview = review.rateeId === actor.id;

        if (isManagerOfReview || isRateeOfReview) return;

        const reviewers = await this.reviewers.listByReview(review.id!, {
            reviewerId: actor.id,
        });

        if (reviewers.length > 0) return;

        throw new ForbiddenException(
            'You do not have permission to view this review',
        );
    }

    /**
     * Checks if the actor has access to the review
     * as an admin, HR, manager, ratee, respondent, or reviewer.
     * @param review The review to check access for.
     * @param actor The actor to check access for.
     */
    private async checkAccessToReview(
        review: ReviewDomain,
        actor?: UserDomain,
    ): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (isAdminOrHr) return;

        const isManagerOfReview = review.managerId === actor.id;
        const isRateeOfReview = review.rateeId === actor.id;

        if (isManagerOfReview || isRateeOfReview) return;

        const respondents = await this.respondents.listByReview(review.id!, {
            respondentId: actor.id,
        });

        if (respondents.length > 0) return;

        const reviewers = await this.reviewers.listByReview(review.id!, {
            reviewerId: actor.id,
        });

        if (reviewers.length > 0) return;

        throw new ForbiddenException(
            'You do not have permission to view this review',
        );
    }

    async update(
        id: number,
        patch: UpdateReviewPayload,
        actor: UserDomain,
    ): Promise<ReviewDomain> {
        const review = await this.getById(id);

        if (review.stage !== ReviewStage.NEW) {
            throw new BadRequestException(
                'Review must be new to be updated. Current stage: ' +
                    review.stage,
            );
        }

        if (patch.cycleId) {
            const cycle = await this.cycles.getById(patch.cycleId);
            if (
                cycle.stage !== CycleStage.NEW &&
                cycle.stage !== CycleStage.ACTIVE
            ) {
                throw new BadRequestException(
                    'Cycle must be new or active to be assigned to review. Current stage: ' +
                        cycle.stage,
                );
            }
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
            ...(patch.reportId !== undefined
                ? { reportId: patch.reportId }
                : {}),
        };

        const updatedReview = await this.reviews.updateById(id, payload);

        // Reactive Trigger: Check if all responses completed
        if (patch.stage && patch.stage === ReviewStage.FINISHED) {
            await this.completeReview(id);
        }

        if (patch.stage && patch.stage !== ReviewStage.FINISHED) {
            await this.changeReviewStage(
                id,
                patch.stage,
                actor.id,
                actor.fullName,
                REVIEW_TRANSITION_REASONS.REVIEW_UPDATED,
            );
        }

        return updatedReview;
    }

    async delete(id: number): Promise<void> {
        await this.getById(id);
        await this.reviews.deleteById(id);
    }

    async createQuestion(
        payload: CreateQuestionPayload,
    ): Promise<QuestionDomain> {
        if (payload.cycleId) {
            const cycle = await this.cycles.getById(payload.cycleId);
            if (
                cycle.stage !== CycleStage.NEW &&
                cycle.stage !== CycleStage.ACTIVE
            ) {
                throw new BadRequestException(
                    'Cycle must be in NEW or ACTIVE stage to be assigned to question. Current stage: ' +
                        cycle.stage,
                );
            }
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
        const question = await this.questions.findById(id);

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        if (question.cycleId) {
            const cycle = await this.cycles.getById(question.cycleId);
            if (
                cycle.stage !== CycleStage.NEW &&
                cycle.stage !== CycleStage.ACTIVE
            ) {
                throw new BadRequestException(
                    'Question cannot be deleted from cycle that is not active. Current stage: ' +
                        cycle.stage,
                );
            }
        }

        await this.questions.deleteById(id);
    }

    async attachQuestion(
        payload: AddQuestionToReviewPayload,
    ): Promise<ReviewQuestionRelationDomain> {
        const review = await this.getById(payload.reviewId);

        if (review.stage !== ReviewStage.NEW) {
            throw new BadRequestException(
                'Review must be not started to be assigned to question. Current stage: ' +
                    review.stage,
            );
        }

        const questionTemplate = await this.questionTemplates.getById(
            payload.questionTemplateId,
        );
        const competence = await this.competences.getById(
            questionTemplate.competenceId,
        );

        const relation = ReviewQuestionRelationDomain.create({
            reviewId: payload.reviewId,
            questionId: questionTemplate.id!,
            questionTitle: questionTemplate.title,
            answerType: questionTemplate.answerType,
            competenceId: questionTemplate.competenceId,
            competenceTitle: competence.title,
            isForSelfassessment: questionTemplate.isForSelfassessment,
        });

        return this.questionRelations.link(relation);
    }

    async listQuestionRelations(
        reviewId: number,
        query: ReviewQuestionRelationSearchQuery,
        actor?: UserDomain,
    ): Promise<ReviewQuestionRelationDomain[]> {
        await this.getById(reviewId, actor);
        return this.questionRelations.listByReview(reviewId, query);
    }

    async detachQuestion(reviewId: number, questionId: number): Promise<void> {
        const review = await this.getById(reviewId);

        if (review.stage !== ReviewStage.NEW) {
            throw new BadRequestException(
                'Question cannot be unassigned from review that is already started. Current stage: ' +
                    review.stage,
            );
        }

        await this.questionRelations.unlink(reviewId, questionId);
    }

    async addAnswer(
        payload: CreateAnswerPayload,
        actor: UserDomain,
    ): Promise<AnswerDomain> {
        const review = await this.getById(payload.reviewId, actor);

        if (
            review.stage !== ReviewStage.IN_PROGRESS &&
            review.stage !== ReviewStage.SELF_ASSESSMENT
        ) {
            throw new BadRequestException(
                'Review must be in progress to add answer. Current stage: ' +
                    review.stage,
            );
        }

        const answer = AnswerDomain.create({
            reviewId: payload.reviewId,
            questionId: payload.questionId,
            respondentCategory: payload.respondentCategory,
            answerType: payload.answerType,
            numericalValue: payload.numericalValue ?? null,
            textValue: payload.textValue ?? null,
        });

        return await this.answers.create(answer);
    }

    async listAnswers(
        reviewId: number,
        respondentCategory?: RespondentCategory,
        actor?: UserDomain,
    ): Promise<AnswerDomain[]> {
        const review = await this.getById(reviewId);
        await this.checkAccessToReviewAnswers(review, actor);

        return this.answers.list({ reviewId: reviewId, respondentCategory });
    }

    async addRespondent(
        payload: AddRespondentPayload,
    ): Promise<RespondentDomain> {
        const review = await this.getById(payload.reviewId);

        if (
            review.stage !== ReviewStage.NEW &&
            review.stage !== ReviewStage.IN_PROGRESS &&
            review.stage !== ReviewStage.WAITING_TO_START &&
            review.stage !== ReviewStage.SELF_ASSESSMENT
        ) {
            throw new BadRequestException(
                'Respondent cannot be added to review that is already finished or cancelled. Current stage: ' +
                    review.stage,
            );
        }

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
        relationId: number,
        patch: UpdateRespondentPayload,
        actor: UserDomain,
    ): Promise<RespondentDomain> {
        await this.checkAccessToUpdateResponseStatus(relationId, actor);

        const relation = await this.respondents.getById(relationId);
        const review = await this.getById(relation.reviewId);

        if (
            review.stage !== ReviewStage.IN_PROGRESS &&
            review.stage !== ReviewStage.SELF_ASSESSMENT
        ) {
            throw new BadRequestException(
                'Review must be in progress to update response status. Current stage: ' +
                    review.stage,
            );
        }

        const responseStatus = patch.responseStatus;
        patch.responseStatus = undefined;

        const updated = await this.respondents.updateById(relationId, patch);

        if (responseStatus) {
            await this.changeRespondentStatus(
                review.id!,
                relationId,
                responseStatus,
                actor.id!,
                actor.fullName,
                RESPONSE_TRANSITION_REASONS.SYSTEM_AUTOMATED,
            );
        }

        return updated;
    }

    /**
     * Centralized method for response status transitions with validation
     * @param reviewId ID of the review
     * @param nextStatus Target status
     * @param actorId User ID who initiated the change (0 for system)
     * @param actorName Full name of the actor
     * @param reason Optional reason for the transition
     */
    async changeRespondentStatus(
        reviewId: number,
        relationId: number,
        nextStatus: ResponseStatus,
        actorId: number = SYSTEM_ACTOR.ID,
        actorName: string = SYSTEM_ACTOR.NAME,
        reason: string = RESPONSE_TRANSITION_REASONS.SYSTEM_AUTOMATED,
    ): Promise<void> {
        const review = await this.getById(reviewId);
        const respondent = await this.respondents.getById(relationId);
        if (respondent.reviewId != reviewId) {
            throw new BadRequestException(
                `Respondent relation ${relationId} does not belong to review ${reviewId}`,
            );
        }
        const currentStatus = respondent.responseStatus;

        // Validate transition is allowed
        const allowedTransitions = RESPONSE_STATUS_TRANSITIONS[currentStatus];
        if (!allowedTransitions.includes(nextStatus)) {
            throw new BadRequestException(
                `Invalid response status transition from ${currentStatus} to ${nextStatus}`,
            );
        }

        await this.respondents.updateById(relationId, {
            responseStatus: nextStatus,
        });

        this.eventEmitter.emit(
            'respondent.status.changed',
            new RespondentStatusChangedEvent(
                reviewId,
                relationId,
                currentStatus,
                nextStatus,
                actorId,
                actorName,
                reason,
            ),
        );
    }

    /**
     * Checks if the actor has access to update the response status of a respondent
     * as an admin or the respondent themselves.
     * @param relationId The respondent identifier.
     * @param actor The actor to check access for.
     */
    private async checkAccessToUpdateResponseStatus(
        relationId: number,
        actor?: UserDomain,
    ): Promise<void> {
        if (!actor) return;

        const isAdmin = actor?.roles?.includes(IdentityRole.ADMIN);

        if (isAdmin) return;

        const respondent = await this.respondents.getById(relationId);

        if (respondent.respondentId === actor.id) return;

        throw new ForbiddenException(
            'You do not have permission to update response status for this review',
        );
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
        actor: UserDomain,
    ): Promise<ReviewerDomain[]> {
        await this.checkAccessToReviewers(reviewId, actor);
        return this.reviewers.listByReview(reviewId, query);
    }

    /**
     * Checks if the actor has access to the reviewers of the review
     * as an admin, hr, manager, or ratee.
     * @param reviewId The review identifier.
     * @param actor The actor to check access for.
     */
    private async checkAccessToReviewers(
        reviewId: number,
        actor?: UserDomain,
    ): Promise<void> {
        if (!actor) return;

        const isAdminOrHr =
            actor?.roles?.includes(IdentityRole.ADMIN) ||
            actor?.roles?.includes(IdentityRole.HR);

        if (isAdminOrHr) return;

        const review = await this.getById(reviewId);

        const isManagerOfReview = review.managerId === actor.id;
        const isRateeOfReview = review.rateeId === actor.id;

        if (isManagerOfReview || isRateeOfReview) return;

        throw new ForbiddenException(
            'You do not have permission to view reviewers of this review',
        );
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

    async getClusterScoreById(
        id: number,
    ): Promise<ClusterScoreWithRelationsDomain> {
        return this.clusterScores.getById(id);
    }

    async getClusterScoreByCycleId(
        cycleId: number,
    ): Promise<ClusterScoreWithRelationsDomain[]> {
        return this.clusterScores.getByCycleId(cycleId);
    }

    async removeClusterScore(id: number): Promise<void> {
        await this.clusterScores.deleteById(id);
    }

    /**
     * Centralized method for review stage transitions with validation and history tracking
     * @param reviewId ID of the review
     * @param nextStage Target stage
     * @param actorId User ID who initiated the change (0 for system)
     * @param actorName Full name of the actor
     * @param reason Optional reason for the transition
     */
    async changeReviewStage(
        reviewId: number,
        nextStage: ReviewStage,
        actorId: number = SYSTEM_ACTOR.ID,
        actorName: string | null = SYSTEM_ACTOR.NAME,
        reason?: string,
    ): Promise<void> {
        const review = await this.getById(reviewId);
        const currentStage = review.stage;

        // Validate transition is allowed
        const allowedTransitions = REVIEW_STAGE_TRANSITIONS[currentStage];

        if (!allowedTransitions.includes(nextStage)) {
            throw new BadRequestException(
                `Invalid review stage transition from ${currentStage} to ${nextStage}`,
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

        // Emit event for listeners to react
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
     * REACTIVE TRIGGER: Checks if all respondents for a review have completed their responses.
     * If yes, automatically transitions the review to the PREPARING_REPORT stage.
     * @param reviewId The review identifier.
     */
    async completeReview(reviewId: number): Promise<void> {
        await this.getById(reviewId);

        // Get all respondents for this review
        const respondents = await this.respondents.listByReview(reviewId, {});

        // Check if there are any pending or in-progress respondents
        const incompleteRespondents = respondents.filter(
            (r) =>
                r.responseStatus === ResponseStatus.PENDING ||
                r.responseStatus === ResponseStatus.IN_PROGRESS,
        );
        const hasPendingResponses = incompleteRespondents.length > 0;

        // If no pending responses, trigger report generation
        if (!hasPendingResponses && respondents.length > 0) {
            await this.changeReviewStage(
                reviewId,
                ReviewStage.FINISHED,
                SYSTEM_ACTOR.ID,
                SYSTEM_ACTOR.NAME,
                REVIEW_TRANSITION_REASONS.ALL_RESPONSES_COLLECTED,
            );
        } else {
            throw new BadRequestException(
                'All responses must be collected to finish the review. Incomplete responses count: ' +
                    incompleteRespondents.length,
            );
        }
    }

    /**
     * MANUAL TRIGGER: HR or ADMIN force-finishes a review
     * Transitions review to PREPARING_REPORT regardless of pending responses
     */
    async forceFinishReview(
        reviewId: number,
        actorId: number,
        actorName: string,
    ): Promise<void> {
        await this.changeReviewStage(
            reviewId,
            ReviewStage.FINISHED,
            actorId,
            actorName,
            REVIEW_TRANSITION_REASONS.FORCE_FINISH,
        );
    }
}
