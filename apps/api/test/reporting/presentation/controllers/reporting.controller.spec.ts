jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import {
    CommentSentiment,
    EntityType,
    IdentityRole,
    InsightType,
    RespondentCategory,
} from '@intra/shared-kernel';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ReportAnalyticsService } from 'src/contexts/reporting/application/services/report-analytics.service';
import { ReportCommentService } from 'src/contexts/reporting/application/services/report-comment.service';
import { ReportInsightService } from 'src/contexts/reporting/application/services/report-insight.service';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';
import { TextAnswerService } from 'src/contexts/reporting/application/services/text-answer.service';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';
import { ReportCommentDomain } from 'src/contexts/reporting/domain/report-comment.domain';
import { ReportInsightDomain } from 'src/contexts/reporting/domain/report-insight.domain';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportingController } from 'src/contexts/reporting/presentation/http/controllers/reporting.controller';

function buildReport(): ReportDomain {
    return ReportDomain.create({
        id: 1,
        reviewId: 10,
        cycleId: 100,
        respondentCount: 5,
        respondentCategories: [RespondentCategory.TEAM],
        answerCount: 20,
        analytics: [],
        comments: [],
        insights: [],
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    });
}

function buildAnalytics(): ReportAnalyticsDomain {
    return ReportAnalyticsDomain.create({
        id: 1,
        reportId: 10,
        entityType: EntityType.QUESTION,
        questionId: 100,
        questionTitle: 'Q?',
        competenceId: null,
        competenceTitle: null,
    });
}

function buildInsight(): ReportInsightDomain {
    return ReportInsightDomain.create({
        id: 1,
        reportId: 10,
        insightType: InsightType.HIGHEST_RATING,
        entityType: EntityType.QUESTION,
        questionId: 100,
        questionTitle: 'Q?',
        competenceId: null,
        competenceTitle: null,
    });
}

function buildComment(): ReportCommentDomain {
    return ReportCommentDomain.create({
        id: 1,
        reportId: 10,
        questionId: 100,
        questionTitle: 'Q?',
        comment: 'Nice',
        respondentCategories: [RespondentCategory.TEAM],
        commentSentiment: CommentSentiment.POSITIVE,
        numberOfMentions: 1,
    });
}

describe('ReportingController', () => {
    let controller: ReportingController;
    let reporting: any;
    let textAnswers: any;
    let analytics: any;
    let insights: any;
    let comments: any;
    const actor = UserDomain.create({
        id: 7,
        firstName: 'HR',
        lastName: 'Admin',
        email: 'hr@example.com',
        roles: [IdentityRole.HR],
    });

    beforeEach(() => {
        reporting = {
            search: jest.fn(),
            getById: jest.fn(),
            getByReviewId: jest.fn(),
        };
        textAnswers = { listByReview: jest.fn() };
        analytics = { getByReportId: jest.fn(), getById: jest.fn() };
        insights = { getByReportId: jest.fn(), getById: jest.fn() };
        comments = {
            getByReportId: jest.fn(),
            getById: jest.fn(),
            create: jest.fn(),
        };

        controller = new ReportingController(
            reporting as unknown as ReportingService,
            textAnswers as unknown as TextAnswerService,
            analytics as unknown as ReportAnalyticsService,
            insights as unknown as ReportInsightService,
            comments as unknown as ReportCommentService,
        );
    });

    describe('search', () => {
        it('forwards query/actor and maps results', async () => {
            reporting.search.mockResolvedValue([buildReport()]);

            const result = await controller.search({} as any, actor);

            expect(reporting.search).toHaveBeenCalledWith({}, actor);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });
    });

    describe('getById', () => {
        it('forwards id/actor to the service', async () => {
            reporting.getById.mockResolvedValue(buildReport());

            const result = await controller.getById(1, actor);

            expect(reporting.getById).toHaveBeenCalledWith(1, actor);
            expect(result.id).toBe(1);
        });
    });

    describe('getByReviewId', () => {
        it('forwards review id/actor to the service', async () => {
            reporting.getByReviewId.mockResolvedValue(buildReport());

            const result = await controller.getByReviewId(10, actor);

            expect(reporting.getByReviewId).toHaveBeenCalledWith(10, actor);
            expect(result.reviewId).toBe(10);
        });
    });

    describe('getTextAnswers', () => {
        it('maps the text answers from the service', async () => {
            textAnswers.listByReview.mockResolvedValue([
                {
                    questionId: 1,
                    questionTitle: 'Q?',
                    respondentCategory: RespondentCategory.TEAM,
                    textValue: 'Great',
                },
            ]);

            const result = await controller.getTextAnswers(10, actor);

            expect(textAnswers.listByReview).toHaveBeenCalledWith(10, actor);
            expect(result).toHaveLength(1);
            expect(result[0].textValue).toBe('Great');
        });
    });

    describe('listReportAnalytics', () => {
        it('maps every analytics row to a response', async () => {
            analytics.getByReportId.mockResolvedValue([buildAnalytics()]);

            const result = await controller.listReportAnalytics(1, actor);

            expect(analytics.getByReportId).toHaveBeenCalledWith(1, actor);
            expect(result).toHaveLength(1);
        });
    });

    describe('getReportAnalyticsById', () => {
        it('forwards id and maps the response', async () => {
            analytics.getById.mockResolvedValue(buildAnalytics());

            const result = await controller.getReportAnalyticsById(1, actor);

            expect(analytics.getById).toHaveBeenCalledWith(1, actor);
            expect(result.id).toBe(1);
        });
    });

    describe('listReportInsights', () => {
        it('maps every insight to a response', async () => {
            insights.getByReportId.mockResolvedValue([buildInsight()]);

            const result = await controller.listReportInsights(1, actor);

            expect(insights.getByReportId).toHaveBeenCalledWith(1, actor);
            expect(result).toHaveLength(1);
        });
    });

    describe('getReportInsightById', () => {
        it('forwards id and maps the response', async () => {
            insights.getById.mockResolvedValue(buildInsight());

            const result = await controller.getReportInsightById(1, actor);

            expect(insights.getById).toHaveBeenCalledWith(1, actor);
            expect(result.id).toBe(1);
        });
    });

    describe('listReportComments', () => {
        it('maps every comment to a response', async () => {
            comments.getByReportId.mockResolvedValue([buildComment()]);

            const result = await controller.listReportComments(1, actor);

            expect(comments.getByReportId).toHaveBeenCalledWith(1, actor);
            expect(result).toHaveLength(1);
        });
    });

    describe('getReportCommentById', () => {
        it('forwards id and maps the response', async () => {
            comments.getById.mockResolvedValue(buildComment());

            const result = await controller.getReportCommentById(1);

            expect(comments.getById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
        });
    });

    describe('create', () => {
        it('builds a domain comment from the dto and forwards to the service', async () => {
            comments.create.mockImplementation(
                async (c: ReportCommentDomain) => c,
            );

            const result = await controller.create(10, {
                reportId: 10,
                questionId: 100,
                questionTitle: 'Q?',
                comment: 'Nice',
                respondentCategories: [RespondentCategory.TEAM],
                commentSentiment: CommentSentiment.POSITIVE,
                numberOfMentions: 2,
            } as any);

            expect(comments.create).toHaveBeenCalledTimes(1);
            const created = comments.create.mock.calls[0][0];
            expect(created).toBeInstanceOf(ReportCommentDomain);
            expect(created.reportId).toBe(10);
            expect(created.commentSentiment).toBe(CommentSentiment.POSITIVE);
            expect(result.comment).toBe('Nice');
        });

        it('defaults sentiment to null when omitted from the dto', async () => {
            comments.create.mockImplementation(
                async (c: ReportCommentDomain) => c,
            );

            await controller.create(10, {
                reportId: 10,
                questionId: 100,
                questionTitle: 'Q?',
                comment: 'X',
                respondentCategories: [RespondentCategory.TEAM],
                numberOfMentions: 1,
            } as any);

            const created = comments.create.mock.calls[0][0];
            expect(created.commentSentiment).toBeNull();
        });
    });
});
