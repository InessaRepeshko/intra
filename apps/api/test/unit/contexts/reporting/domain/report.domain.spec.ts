import { RespondentCategory } from '@intra/shared-kernel';
import Decimal from 'decimal.js';
import { ReportDomain } from 'src/contexts/reporting/domain/report.domain';

describe('ReportDomain', () => {
    const baseProps = {
        reviewId: 1,
        respondentCount: 5,
        respondentCategories: [RespondentCategory.TEAM],
        answerCount: 20,
        analytics: [],
    };

    describe('create', () => {
        it('creates a report with every supplied numeric field as Decimal', () => {
            const report = ReportDomain.create({
                id: 10,
                ...baseProps,
                cycleId: 100,
                turnoutPctOfTeam: '75.5',
                turnoutPctOfOther: 80,
                questionTotAvgBySelf: 4,
                questionTotAvgByTeam: 3.5,
                questionTotAvgByOthers: 4.2,
                questionTotPctBySelf: 80,
                questionTotPctByTeam: 70,
                questionTotPctByOthers: 84,
                questionTotDeltaPctByTeam: -10,
                questionTotDeltaPctByOthers: 4,
                competenceTotAvgBySelf: 4.5,
                competenceTotAvgByTeam: 3.8,
                competenceTotAvgByOthers: 4.1,
                competenceTotPctBySelf: 90,
                competenceTotPctByTeam: 76,
                competenceTotPctByOthers: 82,
                competenceTotDeltaPctByTeam: -14,
                competenceTotDeltaPctByOthers: -8,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                comments: [],
                insights: [],
            });

            expect(report.id).toBe(10);
            expect(report.reviewId).toBe(1);
            expect(report.cycleId).toBe(100);
            expect(report.respondentCount).toBe(5);
            expect(report.respondentCategories).toEqual([
                RespondentCategory.TEAM,
            ]);
            expect(report.answerCount).toBe(20);
            expect(report.turnoutPctOfTeam).toBeInstanceOf(Decimal);
            expect(report.turnoutPctOfTeam!.toString()).toBe('75.5');
            expect(report.turnoutPctOfOther).toBeInstanceOf(Decimal);
            expect(report.turnoutPctOfOther!.toNumber()).toBe(80);
            expect(report.questionTotAvgBySelf!.toNumber()).toBe(4);
            expect(report.competenceTotDeltaPctByOthers!.toNumber()).toBe(-8);
            expect(report.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('defaults cycleId and missing decimal fields to null', () => {
            const report = ReportDomain.create(baseProps);

            expect(report.cycleId).toBeNull();
            expect(report.turnoutPctOfTeam).toBeNull();
            expect(report.turnoutPctOfOther).toBeNull();
            expect(report.questionTotAvgBySelf).toBeNull();
            expect(report.competenceTotDeltaPctByOthers).toBeNull();
        });

        it('defaults analytics, comments, and insights to empty arrays', () => {
            const report = ReportDomain.create(baseProps);

            expect(report.analytics).toEqual([]);
            expect(report.comments).toEqual([]);
            expect(report.insights).toEqual([]);
        });

        it('preserves explicit null on optional decimal fields', () => {
            const report = ReportDomain.create({
                ...baseProps,
                turnoutPctOfTeam: null,
                turnoutPctOfOther: null,
            });

            expect(report.turnoutPctOfTeam).toBeNull();
            expect(report.turnoutPctOfOther).toBeNull();
        });
    });

    describe('withAnalytics / withComments / withInsights', () => {
        it('returns a new instance carrying the supplied analytics', () => {
            const report = ReportDomain.create(baseProps);
            const next = report.withAnalytics([{ id: 1 } as any]);

            expect(next).not.toBe(report);
            expect(next.analytics).toEqual([{ id: 1 }]);
            expect(report.analytics).toEqual([]);
        });

        it('returns a new instance carrying the supplied comments', () => {
            const report = ReportDomain.create(baseProps);
            const next = report.withComments([{ id: 2 } as any]);

            expect(next).not.toBe(report);
            expect(next.comments).toEqual([{ id: 2 }]);
        });

        it('returns a new instance carrying the supplied insights', () => {
            const report = ReportDomain.create(baseProps);
            const next = report.withInsights([{ id: 3 } as any]);

            expect(next).not.toBe(report);
            expect(next.insights).toEqual([{ id: 3 }]);
        });
    });
});
