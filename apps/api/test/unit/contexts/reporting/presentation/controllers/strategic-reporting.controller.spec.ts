jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { IdentityRole, InsightType } from '@intra/shared-kernel';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { StartegicReportInsightService } from 'src/contexts/reporting/application/services/startegic-report-insight.service';
import { StrategicReportAnalyticsService } from 'src/contexts/reporting/application/services/strategic-report-analytics.service';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
import { StrategicReportInsightDomain } from 'src/contexts/reporting/domain/startegic-report-insight.domain';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';
import { StrategicReportDomain } from 'src/contexts/reporting/domain/strategic-report.domain';
import { StrategicReportingController } from 'src/contexts/reporting/presentation/http/controllers/strategic-reporting.controller';

function buildReport(): StrategicReportDomain {
    return StrategicReportDomain.create({
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
        competenceCount: 0,
        competenceIds: [],
        questionCount: 0,
        questionIds: [],
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    });
}

function buildAnalytics(): StrategicReportAnalyticsDomain {
    return StrategicReportAnalyticsDomain.create({
        id: 1,
        strategicReportId: 10,
        competenceId: 7,
        competenceTitle: 'Teamwork',
    });
}

function buildInsight(): StrategicReportInsightDomain {
    return StrategicReportInsightDomain.create({
        id: 1,
        strategicReportId: 10,
        insightType: InsightType.HIGHEST_RATING,
        competenceId: 7,
        competenceTitle: 'Teamwork',
    });
}

describe('StrategicReportingController', () => {
    let controller: StrategicReportingController;
    let strategicReporting: any;
    let strategicAnalytics: any;
    let strategicInsights: any;
    const actor = UserDomain.create({
        id: 7,
        firstName: 'HR',
        lastName: 'Admin',
        email: 'hr@example.com',
        roles: [IdentityRole.HR],
    });

    beforeEach(() => {
        strategicReporting = {
            search: jest.fn(),
            getById: jest.fn(),
            getByCycleId: jest.fn(),
        };
        strategicAnalytics = {
            getByStrategicReportId: jest.fn(),
            getById: jest.fn(),
        };
        strategicInsights = {
            getByStrategicReportId: jest.fn(),
            getById: jest.fn(),
        };

        controller = new StrategicReportingController(
            strategicReporting as unknown as StrategicReportingService,
            strategicAnalytics as unknown as StrategicReportAnalyticsService,
            strategicInsights as unknown as StartegicReportInsightService,
        );
    });

    describe('search', () => {
        it('forwards query/actor and maps results', async () => {
            strategicReporting.search.mockResolvedValue([buildReport()]);

            const result = await controller.search({} as any, actor);

            expect(strategicReporting.search).toHaveBeenCalledWith({}, actor);
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });
    });

    describe('getById', () => {
        it('forwards id/actor to the service', async () => {
            strategicReporting.getById.mockResolvedValue(buildReport());

            const result = await controller.getById(1, actor);

            expect(strategicReporting.getById).toHaveBeenCalledWith(1, actor);
            expect(result.id).toBe(1);
        });
    });

    describe('getByCycleId', () => {
        it('forwards cycle id/actor to the service', async () => {
            strategicReporting.getByCycleId.mockResolvedValue(buildReport());

            const result = await controller.getByCycleId(100, actor);

            expect(strategicReporting.getByCycleId).toHaveBeenCalledWith(
                100,
                actor,
            );
            expect(result.cycleId).toBe(100);
        });
    });

    describe('listStrategicReportAnalytics', () => {
        it('maps every analytics row to a response', async () => {
            strategicAnalytics.getByStrategicReportId.mockResolvedValue([
                buildAnalytics(),
            ]);

            const result = await controller.listStrategicReportAnalytics(
                1,
                actor,
            );

            expect(
                strategicAnalytics.getByStrategicReportId,
            ).toHaveBeenCalledWith(1, actor);
            expect(result).toHaveLength(1);
        });
    });

    describe('getStrategicReportAnalyticsById', () => {
        it('forwards id and maps the response', async () => {
            strategicAnalytics.getById.mockResolvedValue(buildAnalytics());

            const result = await controller.getStrategicReportAnalyticsById(
                1,
                actor,
            );

            expect(strategicAnalytics.getById).toHaveBeenCalledWith(1, actor);
            expect(result.id).toBe(1);
        });
    });

    describe('listStrategicReportInsights', () => {
        it('maps every insight to a response', async () => {
            strategicInsights.getByStrategicReportId.mockResolvedValue([
                buildInsight(),
            ]);

            const result = await controller.listStrategicReportInsights(
                1,
                actor,
            );

            expect(
                strategicInsights.getByStrategicReportId,
            ).toHaveBeenCalledWith(1, actor);
            expect(result).toHaveLength(1);
        });
    });

    describe('getStrategicReportInsightById', () => {
        it('forwards id and maps the response', async () => {
            strategicInsights.getById.mockResolvedValue(buildInsight());

            const result = await controller.getStrategicReportInsightById(
                1,
                actor,
            );

            expect(strategicInsights.getById).toHaveBeenCalledWith(1, actor);
            expect(result.id).toBe(1);
        });
    });
});
