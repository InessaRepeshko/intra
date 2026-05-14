import { InsightType } from '@intra/shared-kernel';
import { StrategicReportInsightDomain } from 'src/contexts/reporting/domain/startegic-report-insight.domain';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { StrategicReportHttpMapper } from 'src/contexts/reporting/presentation/http/mappers/strategic-report.http.mapper';

describe('StrategicReportHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response and includes relations', () => {
            const analytics = StrategicReportAnalyticsDomain.create({
                strategicReportId: 1,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageBySelfAssessment: 4,
            });
            const insight = StrategicReportInsightDomain.create({
                strategicReportId: 1,
                insightType: InsightType.HIGHEST_RATING,
                competenceId: 7,
                competenceTitle: 'Teamwork',
                averageScore: 4.5,
            });

            const domain = StrategicReportDomain.create({
                id: 1,
                cycleId: 100,
                cycleTitle: 'Q1',
                rateeCount: 1,
                rateeIds: [11],
                respondentCount: 2,
                respondentIds: [20, 21],
                answerCount: 50,
                reviewerCount: 1,
                reviewerIds: [40],
                teamCount: 0,
                teamIds: [],
                positionCount: 0,
                positionIds: [],
                competenceCount: 1,
                competenceIds: [7],
                questionCount: 0,
                questionIds: [],
                turnoutAvgPctOfRatees: 100,
                turnoutAvgPctOfTeams: 90.5,
                turnoutAvgPctOfOthers: 88,
                competenceGeneralAvgSelf: 4,
                analytics: [analytics],
                insights: [insight],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = StrategicReportHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.cycleId).toBe(100);
            expect(response.cycleTitle).toBe('Q1');
            expect(response.rateeIds).toEqual([11]);
            expect(response.respondentIds).toEqual([20, 21]);
            expect(response.competenceIds).toEqual([7]);
            expect(response.turnoutAvgPctOfRatees).toBe(100);
            expect(response.turnoutAvgPctOfTeams).toBe(90.5);
            expect(response.competenceGeneralAvgSelf).toBe(4);
            expect(response.analytics).toHaveLength(1);
            expect(response.analytics[0].competenceId).toBe(7);
            expect(response.insights).toHaveLength(1);
            expect(response.insights[0].insightType).toBe(
                InsightType.HIGHEST_RATING,
            );
        });

        it('returns empty analytics/insights arrays when none are provided', () => {
            const domain = StrategicReportDomain.create({
                id: 1,
                cycleId: 100,
                cycleTitle: 'Q1',
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
            });

            const response = StrategicReportHttpMapper.toResponse(domain);

            expect(response.analytics).toEqual([]);
            expect(response.insights).toEqual([]);
            expect(response.turnoutAvgPctOfRatees).toBeNull();
            expect(response.competenceGeneralAvgSelf).toBeNull();
        });
    });
});
