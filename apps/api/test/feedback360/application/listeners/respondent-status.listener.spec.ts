import {
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});
import { TRANSITION_REASONS } from 'src/contexts/feedback360/application/constants/review-stage-transitions';
import { RespondentStatusChangedEvent } from 'src/contexts/feedback360/application/events/respondent-status-changed.event';
import {
    RespondentStatusListener,
    SelfAssessmentCompletedListener,
} from 'src/contexts/feedback360/application/listeners/respondent-status.listener';
import { RESPONDENT_REPOSITORY } from 'src/contexts/feedback360/application/ports/respondent.repository.port';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';

function buildRespondent(
    overrides: Partial<Parameters<typeof RespondentDomain.create>[0]> = {},
): RespondentDomain {
    return RespondentDomain.create({
        id: 1,
        reviewId: 1,
        respondentId: 200,
        fullName: 'R',
        category: RespondentCategory.TEAM,
        positionId: 1,
        positionTitle: 'Eng',
        ...overrides,
    });
}

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 1,
        rateeId: 1,
        rateeFullName: 'Ratee',
        rateePositionId: 1,
        rateePositionTitle: 'Engineer',
        hrId: 2,
        hrFullName: 'HR',
        ...overrides,
    });
}

describe('RespondentStatusListener', () => {
    let listener: RespondentStatusListener;
    let respondents: any;
    let reviewService: any;
    let eventEmitter: any;

    beforeEach(async () => {
        respondents = { listByReview: jest.fn() };
        reviewService = { completeReview: jest.fn() };
        eventEmitter = { emit: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                RespondentStatusListener,
                { provide: RESPONDENT_REPOSITORY, useValue: respondents },
                { provide: ReviewService, useValue: reviewService },
                { provide: EventEmitter2, useValue: eventEmitter },
            ],
        }).compile();

        listener = module.get(RespondentStatusListener);
    });

    it('ignores transitions that are not COMPLETED or CANCELED', async () => {
        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.PENDING,
            ResponseStatus.IN_PROGRESS,
        );

        await listener.handleRespondentStatusChanged(event);

        expect(respondents.listByReview).not.toHaveBeenCalled();
        expect(reviewService.completeReview).not.toHaveBeenCalled();
    });

    it('completes the review when all respondents are COMPLETED or CANCELED', async () => {
        respondents.listByReview.mockResolvedValue([
            buildRespondent({ responseStatus: ResponseStatus.COMPLETED }),
            buildRespondent({ responseStatus: ResponseStatus.CANCELED }),
        ]);

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
        );

        await listener.handleRespondentStatusChanged(event);

        expect(reviewService.completeReview).toHaveBeenCalledWith(1);
    });

    it('does not complete the review if any response is still pending', async () => {
        respondents.listByReview.mockResolvedValue([
            buildRespondent({ responseStatus: ResponseStatus.COMPLETED }),
            buildRespondent({ responseStatus: ResponseStatus.PENDING }),
        ]);

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
        );

        await listener.handleRespondentStatusChanged(event);

        expect(reviewService.completeReview).not.toHaveBeenCalled();
    });

    it('swallows errors when checking completion fails', async () => {
        respondents.listByReview.mockRejectedValue(new Error('boom'));

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
        );

        await expect(
            listener.handleRespondentStatusChanged(event),
        ).resolves.toBeUndefined();
    });
});

describe('SelfAssessmentCompletedListener', () => {
    let listener: SelfAssessmentCompletedListener;
    let respondents: any;
    let reviews: any;
    let reviewService: any;

    beforeEach(async () => {
        respondents = { getById: jest.fn() };
        reviews = { findById: jest.fn() };
        reviewService = { changeReviewStage: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                SelfAssessmentCompletedListener,
                { provide: RESPONDENT_REPOSITORY, useValue: respondents },
                { provide: REVIEW_REPOSITORY, useValue: reviews },
                { provide: ReviewService, useValue: reviewService },
            ],
        }).compile();

        listener = module.get(SelfAssessmentCompletedListener);
    });

    it('ignores transitions that are not COMPLETED', async () => {
        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.PENDING,
            ResponseStatus.IN_PROGRESS,
        );

        await listener.handleRespondentCompleted(event);

        expect(respondents.getById).not.toHaveBeenCalled();
    });

    it('ignores respondents that are not SELF_ASSESSMENT category', async () => {
        respondents.getById.mockResolvedValue(
            buildRespondent({ category: RespondentCategory.TEAM }),
        );

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
        );

        await listener.handleRespondentCompleted(event);

        expect(reviewService.changeReviewStage).not.toHaveBeenCalled();
    });

    it('logs a warning and returns when the review cannot be found', async () => {
        respondents.getById.mockResolvedValue(
            buildRespondent({
                category: RespondentCategory.SELF_ASSESSMENT,
            }),
        );
        reviews.findById.mockResolvedValue(null);

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
        );

        await listener.handleRespondentCompleted(event);

        expect(reviewService.changeReviewStage).not.toHaveBeenCalled();
    });

    it('skips when the review is not in SELF_ASSESSMENT stage', async () => {
        respondents.getById.mockResolvedValue(
            buildRespondent({
                category: RespondentCategory.SELF_ASSESSMENT,
            }),
        );
        reviews.findById.mockResolvedValue(
            buildReview({ stage: ReviewStage.IN_PROGRESS }),
        );

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
        );

        await listener.handleRespondentCompleted(event);

        expect(reviewService.changeReviewStage).not.toHaveBeenCalled();
    });

    it('advances the review from SELF_ASSESSMENT to IN_PROGRESS on self-assessment completion', async () => {
        respondents.getById.mockResolvedValue(
            buildRespondent({
                category: RespondentCategory.SELF_ASSESSMENT,
            }),
        );
        reviews.findById.mockResolvedValue(
            buildReview({ stage: ReviewStage.SELF_ASSESSMENT }),
        );

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
            7,
            'Ratee',
        );

        await listener.handleRespondentCompleted(event);

        expect(reviewService.changeReviewStage).toHaveBeenCalledWith(
            1,
            ReviewStage.IN_PROGRESS,
            7,
            'Ratee',
            TRANSITION_REASONS.SYSTEM_AUTOMATED,
        );
    });

    it('swallows errors from the review stage transition', async () => {
        respondents.getById.mockResolvedValue(
            buildRespondent({
                category: RespondentCategory.SELF_ASSESSMENT,
            }),
        );
        reviews.findById.mockResolvedValue(
            buildReview({ stage: ReviewStage.SELF_ASSESSMENT }),
        );
        reviewService.changeReviewStage.mockRejectedValue(new Error('boom'));

        const event = new RespondentStatusChangedEvent(
            1,
            10,
            ResponseStatus.IN_PROGRESS,
            ResponseStatus.COMPLETED,
        );

        await expect(
            listener.handleRespondentCompleted(event),
        ).resolves.toBeUndefined();
    });
});
