import {
    Report as PrismaReport,
    ReportAnalytics as PrismaReportAnalytics,
    ReportComment as PrismaReportComment,
    ReportInsights as PrismaReportInsights,
} from '@intra/database';
import { RespondentCategory } from '@intra/shared-kernel';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';
import { ReportMapper } from 'src/contexts/reporting/infrastructure/mappers/report.mapper';

function buildPrismaReport(
    overrides: Partial<PrismaReport> = {},
): PrismaReport {
    return {
        id: 1,
        reviewId: 10,
        cycleId: 100,
        respondentCount: 5,
        respondentCategories: [
            'TEAM',
            'OTHER',
        ] as PrismaReport['respondentCategories'],
        answerCount: 20,
        turnoutPctOfTeam: '75.5000',
        turnoutPctOfOther: '80.0000',
        questionTotAvgBySelf: '4.0000',
        questionTotAvgByTeam: '3.5000',
        questionTotAvgByOthers: '4.2000',
        questionTotPctBySelf: '80.0000',
        questionTotPctByTeam: '70.0000',
        questionTotPctByOthers: '84.0000',
        questionTotDeltaPctByTeam: '-10.0000',
        questionTotDeltaPctByOthers: '4.0000',
        competenceTotAvgBySelf: '4.5000',
        competenceTotAvgByTeam: '3.8000',
        competenceTotAvgByOthers: '4.1000',
        competenceTotPctBySelf: '90.0000',
        competenceTotPctByTeam: '76.0000',
        competenceTotPctByOthers: '82.0000',
        competenceTotDeltaPctByTeam: '-14.0000',
        competenceTotDeltaPctByOthers: '-8.0000',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        ...overrides,
    } as unknown as PrismaReport;
}

describe('ReportMapper', () => {
    describe('toDomain', () => {
        it('converts a prisma row into a ReportDomain with empty relations', () => {
            const domain = ReportMapper.toDomain(buildPrismaReport());

            expect(domain).toBeInstanceOf(ReportDomain);
            expect(domain.id).toBe(1);
            expect(domain.reviewId).toBe(10);
            expect(domain.cycleId).toBe(100);
            expect(domain.respondentCount).toBe(5);
            expect(domain.respondentCategories).toEqual([
                RespondentCategory.TEAM,
                RespondentCategory.OTHER,
            ]);
            expect(domain.turnoutPctOfTeam!.toNumber()).toBe(75.5);
            expect(domain.competenceTotDeltaPctByOthers!.toNumber()).toBe(-8);
            expect(domain.analytics).toEqual([]);
            expect(domain.comments).toEqual([]);
            expect(domain.insights).toEqual([]);
        });
    });

    describe('toDomainWithRelations', () => {
        it('includes analytics, comments, and insights in the aggregate', () => {
            const prismaAnalytic = {
                id: 1,
                reportId: 1,
                entityType: 'QUESTION',
                questionId: 100,
                questionTitle: 'Q?',
                competenceId: null,
                competenceTitle: null,
                averageBySelfAssessment: '4.0000',
                averageByTeam: '3.5000',
                averageByOther: '4.2500',
                percentageBySelfAssessment: '80.0000',
                percentageByTeam: '70.0000',
                percentageByOther: '85.0000',
                deltaPercentageByTeam: '-10.0000',
                deltaPercentageByOther: '5.0000',
                createdAt: new Date(),
            } as unknown as PrismaReportAnalytics;

            const prismaComment = {
                id: 1,
                reportId: 1,
                questionId: 100,
                questionTitle: 'Q?',
                comment: 'Nice',
                respondentCategories: ['TEAM'],
                commentSentiment: 'POSITIVE',
                numberOfMentions: 1,
                createdAt: new Date(),
            } as unknown as PrismaReportComment;

            const prismaInsight = {
                id: 1,
                reportId: 1,
                insightType: 'HIGHEST_RATING',
                entityType: 'QUESTION',
                questionId: 100,
                questionTitle: 'Q?',
                competenceId: null,
                competenceTitle: null,
                averageScore: '4.5000',
                averageRating: '90.0000',
                averageDelta: '-5.0000',
                createdAt: new Date(),
            } as unknown as PrismaReportInsights;

            const domain = ReportMapper.toDomainWithRelations({
                ...buildPrismaReport(),
                analytics: [prismaAnalytic],
                comments: [prismaComment],
                insights: [prismaInsight],
            });

            expect(domain.analytics).toHaveLength(1);
            expect(domain.analytics[0].questionId).toBe(100);
            expect(domain.comments).toHaveLength(1);
            expect(domain.comments![0].comment).toBe('Nice');
            expect(domain.insights).toHaveLength(1);
            expect(domain.insights![0].averageRating!.toNumber()).toBe(90);
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain object into a Prisma create input', () => {
            const domain = ReportDomain.create({
                reviewId: 10,
                cycleId: 100,
                respondentCount: 5,
                respondentCategories: [RespondentCategory.TEAM],
                answerCount: 20,
                turnoutPctOfTeam: 75.5,
                turnoutPctOfOther: 80,
                analytics: [],
            });

            const prisma = ReportMapper.toPrisma(domain);

            expect(prisma.reviewId).toBe(10);
            expect(prisma.cycleId).toBe(100);
            expect(prisma.respondentCount).toBe(5);
            expect(prisma.respondentCategories).toEqual(['TEAM']);
            expect(prisma.answerCount).toBe(20);
            expect(prisma.turnoutPctOfTeam).toBe('75.5000');
            expect(prisma.turnoutPctOfOther).toBe('80.0000');
            // Missing decimal field → undefined
            expect(prisma.questionTotAvgBySelf).toBeUndefined();
        });
    });

    describe('respondent category conversions', () => {
        it('uppercases in both directions', () => {
            expect(
                ReportMapper.toPrismaRespondentCategory(RespondentCategory.TEAM),
            ).toBe('TEAM');
            expect(
                ReportMapper.toDomainRespondentCategory(
                    'OTHER' as any,
                ),
            ).toBe(RespondentCategory.OTHER);
        });
    });
});
