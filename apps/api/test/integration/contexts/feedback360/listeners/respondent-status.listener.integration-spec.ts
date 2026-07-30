import '../../../setup-env';

import {
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { RespondentStatusChangedEvent } from 'src/contexts/feedback360/application/events/respondent-status-changed.event';
import {
    RespondentStatusListener,
    SelfAssessmentCompletedListener,
} from 'src/contexts/feedback360/application/listeners/respondent-status.listener';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { CycleRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/cycle.repository';
import { RespondentRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/respondent.repository';
import { ReviewRepository } from 'src/contexts/feedback360/infrastructure/prisma-repositories/review.repository';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/position.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createFeedback360TestModule,
    resetFeedback360Tables,
} from '../test-app-feedback360';

describe('RespondentStatusListener / SelfAssessmentCompletedListener (feedback360, integration)', () => {
    let module: TestingModule;
    let respondentListener: RespondentStatusListener;
    let selfAssessmentListener: SelfAssessmentCompletedListener;
    let cycleRepo: CycleRepository;
    let reviewRepo: ReviewRepository;
    let respondentRepo: RespondentRepository;
    let positionRepo: PositionRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;

    let hrId: number;
    let rateeId: number;
    let positionId: number;
    let cycleId: number;

    beforeAll(async () => {
        module = await createFeedback360TestModule();
        respondentListener = module.get(RespondentStatusListener);
        selfAssessmentListener = module.get(SelfAssessmentCompletedListener);
        cycleRepo = module.get(CycleRepository);
        reviewRepo = module.get(ReviewRepository);
        respondentRepo = module.get(RespondentRepository);
        positionRepo = module.get(PositionRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetFeedback360Tables(prisma);
        const hr = await identityUsers.create({
            firstName: 'Helena',
            lastName: 'Reed',
            email: `hr.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const ratee = await identityUsers.create({
            firstName: 'Robert',
            lastName: 'Smith',
            email: `ratee.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        const position = await positionRepo.create(
            PositionDomain.create({ title: 'Engineer' }),
        );
        const cycle = await cycleRepo.create(
            CycleDomain.create({
                title: 'Cycle',
                hrId: hr.id!,
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-03-31'),
            }),
        );

        hrId = hr.id!;
        rateeId = ratee.id!;
        positionId = position.id!;
        cycleId = cycle.id!;
    });

    afterAll(async () => {
        await module.close();
    });

    async function createReview(stage: ReviewStage): Promise<number> {
        const review = await reviewRepo.create(
            ReviewDomain.create({
                rateeId,
                rateeFullName: 'Robert Smith',
                rateePositionId: positionId,
                rateePositionTitle: 'Engineer',
                hrId,
                hrFullName: 'Helena Reed',
                cycleId,
                stage,
            }),
        );
        return review.id!;
    }

    async function newUserId(seed: string): Promise<number> {
        const user = await identityUsers.create({
            firstName: seed,
            lastName: 'P',
            email: `${seed}.${Date.now()}.${Math.random()}@example.com`,
        } as any);
        return user.id!;
    }

    async function addRespondent(
        reviewId: number,
        category: RespondentCategory,
        status: ResponseStatus,
        respondentId?: number,
    ): Promise<number> {
        const id = respondentId ?? (await newUserId('R'));
        const respondent = await respondentRepo.create(
            RespondentDomain.create({
                reviewId,
                respondentId: id,
                fullName: 'R P',
                category,
                responseStatus: status,
                positionId,
                positionTitle: 'Engineer',
            }),
        );
        return respondent.id!;
    }

    describe('RespondentStatusListener.handleRespondentStatusChanged', () => {
        it('does nothing when status is not COMPLETED or CANCELED', async () => {
            const reviewId = await createReview(ReviewStage.IN_PROGRESS);
            const respondentRelationId = await addRespondent(
                reviewId,
                RespondentCategory.TEAM,
                ResponseStatus.IN_PROGRESS,
            );

            await respondentListener.handleRespondentStatusChanged(
                new RespondentStatusChangedEvent(
                    reviewId,
                    respondentRelationId,
                    ResponseStatus.PENDING,
                    ResponseStatus.IN_PROGRESS,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.IN_PROGRESS);
        });

        it('completes the review when all respondents are COMPLETED', async () => {
            const reviewId = await createReview(ReviewStage.IN_PROGRESS);
            const respondentId = await addRespondent(
                reviewId,
                RespondentCategory.TEAM,
                ResponseStatus.COMPLETED,
            );

            await respondentListener.handleRespondentStatusChanged(
                new RespondentStatusChangedEvent(
                    reviewId,
                    respondentId,
                    ResponseStatus.IN_PROGRESS,
                    ResponseStatus.COMPLETED,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.FINISHED);
        });

        it('does not complete the review when some respondents are still PENDING', async () => {
            const reviewId = await createReview(ReviewStage.IN_PROGRESS);
            const userA = await newUserId('A');
            const userB = await newUserId('B');
            const relA = await addRespondent(
                reviewId,
                RespondentCategory.TEAM,
                ResponseStatus.COMPLETED,
                userA,
            );
            await addRespondent(
                reviewId,
                RespondentCategory.TEAM,
                ResponseStatus.PENDING,
                userB,
            );

            await respondentListener.handleRespondentStatusChanged(
                new RespondentStatusChangedEvent(
                    reviewId,
                    relA,
                    ResponseStatus.IN_PROGRESS,
                    ResponseStatus.COMPLETED,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.IN_PROGRESS);
        });
    });

    describe('SelfAssessmentCompletedListener.handleRespondentCompleted', () => {
        it('advances the review SELF_ASSESSMENT → IN_PROGRESS when the ratee completes self-assessment', async () => {
            const reviewId = await createReview(ReviewStage.SELF_ASSESSMENT);
            const respondentId = await addRespondent(
                reviewId,
                RespondentCategory.SELF_ASSESSMENT,
                ResponseStatus.COMPLETED,
                rateeId,
            );

            await selfAssessmentListener.handleRespondentCompleted(
                new RespondentStatusChangedEvent(
                    reviewId,
                    respondentId,
                    ResponseStatus.IN_PROGRESS,
                    ResponseStatus.COMPLETED,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.IN_PROGRESS);
        });

        it('skips the transition when the completed respondent is not a SELF_ASSESSMENT', async () => {
            const reviewId = await createReview(ReviewStage.SELF_ASSESSMENT);
            const respondentId = await addRespondent(
                reviewId,
                RespondentCategory.TEAM,
                ResponseStatus.COMPLETED,
            );

            await selfAssessmentListener.handleRespondentCompleted(
                new RespondentStatusChangedEvent(
                    reviewId,
                    respondentId,
                    ResponseStatus.IN_PROGRESS,
                    ResponseStatus.COMPLETED,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.SELF_ASSESSMENT);
        });

        it('skips the transition when the review is not in SELF_ASSESSMENT stage', async () => {
            const reviewId = await createReview(ReviewStage.IN_PROGRESS);
            const respondentId = await addRespondent(
                reviewId,
                RespondentCategory.SELF_ASSESSMENT,
                ResponseStatus.COMPLETED,
                rateeId,
            );

            await selfAssessmentListener.handleRespondentCompleted(
                new RespondentStatusChangedEvent(
                    reviewId,
                    respondentId,
                    ResponseStatus.IN_PROGRESS,
                    ResponseStatus.COMPLETED,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.IN_PROGRESS);
        });

        it('does nothing when toStatus is not COMPLETED', async () => {
            const reviewId = await createReview(ReviewStage.SELF_ASSESSMENT);
            const respondentId = await addRespondent(
                reviewId,
                RespondentCategory.SELF_ASSESSMENT,
                ResponseStatus.IN_PROGRESS,
                rateeId,
            );

            await selfAssessmentListener.handleRespondentCompleted(
                new RespondentStatusChangedEvent(
                    reviewId,
                    respondentId,
                    ResponseStatus.PENDING,
                    ResponseStatus.IN_PROGRESS,
                ),
            );

            const reviewAfter = await reviewRepo.findById(reviewId);
            expect(reviewAfter!.stage).toBe(ReviewStage.SELF_ASSESSMENT);
        });
    });
});
