import Decimal from 'decimal.js';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';

describe('StrategicReportDomain', () => {
    const baseProps = {
        cycleId: 100,
        cycleTitle: 'Q1 2025',
        rateeCount: 0,
        rateeIds: [],
        respondentCount: 0,
        respondentIds: [],
        answerCount: 0,
        reviewerCount: 0,
        reviewerIds: [],
        teamCount: 0,
        teamIds: [],
        positionCount: 0,
        positionIds: [],
        competenceCount: 0,
        competenceIds: [],
        questionCount: 0,
        questionIds: [],
    };

    describe('create', () => {
        it('creates a strategic report with every supplied field', () => {
            const report = StrategicReportDomain.create({
                id: 1,
                ...baseProps,
                rateeCount: 3,
                rateeIds: [11, 12, 13],
                respondentCount: 5,
                respondentIds: [20, 21, 22, 23, 24],
                answerCount: 50,
                reviewerCount: 2,
                reviewerIds: [40, 41],
                teamCount: 2,
                teamIds: [1, 2],
                positionCount: 4,
                positionIds: [3, 4, 5, 6],
                competenceCount: 7,
                competenceIds: [100, 101, 102, 103, 104, 105, 106],
                questionCount: 12,
                questionIds: [
                    200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211,
                ],
                turnoutAvgPctOfRatees: 100,
                turnoutAvgPctOfTeams: '90.5',
                turnoutAvgPctOfOthers: 88,
                competenceGeneralAvgSelf: 4,
                competenceGeneralAvgTeam: 3.5,
                competenceGeneralAvgOther: 3.9,
                competenceGeneralPctSelf: 80,
                competenceGeneralPctTeam: 70,
                competenceGeneralPctOther: 78,
                competenceGeneralDeltaTeam: -10,
                competenceGeneralDeltaOther: -2,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(report.id).toBe(1);
            expect(report.cycleId).toBe(100);
            expect(report.cycleTitle).toBe('Q1 2025');
            expect(report.rateeCount).toBe(3);
            expect(report.rateeIds).toEqual([11, 12, 13]);
            expect(report.answerCount).toBe(50);
            expect(report.turnoutAvgPctOfTeams).toBeInstanceOf(Decimal);
            expect(report.turnoutAvgPctOfTeams!.toString()).toBe('90.5');
            expect(report.competenceGeneralDeltaTeam!.toNumber()).toBe(-10);
        });

        it('defaults missing decimal fields to null', () => {
            const report = StrategicReportDomain.create(baseProps);

            expect(report.turnoutAvgPctOfRatees).toBeNull();
            expect(report.turnoutAvgPctOfTeams).toBeNull();
            expect(report.competenceGeneralAvgSelf).toBeNull();
            expect(report.competenceGeneralDeltaOther).toBeNull();
        });

        it('defaults analytics and insights to empty arrays', () => {
            const report = StrategicReportDomain.create(baseProps);

            expect(report.analytics).toEqual([]);
            expect(report.insights).toEqual([]);
        });
    });

    describe('withAnalytics / withInsights', () => {
        it('returns a new instance with the supplied analytics', () => {
            const report = StrategicReportDomain.create(baseProps);
            const next = report.withAnalytics([{ id: 1 } as any]);

            expect(next).not.toBe(report);
            expect(next.analytics).toEqual([{ id: 1 }]);
        });

        it('returns a new instance with the supplied insights', () => {
            const report = StrategicReportDomain.create(baseProps);
            const next = report.withInsights([{ id: 2 } as any]);

            expect(next).not.toBe(report);
            expect(next.insights).toEqual([{ id: 2 }]);
        });
    });
});
