import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { STRATEGIC_REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-analytics.repository.port';
import { StrategicReportAnalyticsService } from 'src/contexts/reporting/application/services/strategic-report-analytics.service';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
import { StrategicReportAnalyticsDomain } from 'src/contexts/reporting/domain/strategic-report-analytics.domain';

function buildAnalytics(strategicReportId = 10): StrategicReportAnalyticsDomain {
    return StrategicReportAnalyticsDomain.create({
        id: 1,
        strategicReportId,
        competenceId: 7,
        competenceTitle: 'Teamwork',
    });
}

describe('StrategicReportAnalyticsService', () => {
    let service: StrategicReportAnalyticsService;
    let analytics: any;
    let strategicReporting: any;

    beforeEach(async () => {
        analytics = {
            findByStrategicReportId: jest.fn(),
            findById: jest.fn(),
        };
        strategicReporting = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                StrategicReportAnalyticsService,
                {
                    provide: STRATEGIC_REPORT_ANALYTICS_REPOSITORY,
                    useValue: analytics,
                },
                {
                    provide: StrategicReportingService,
                    useValue: strategicReporting,
                },
            ],
        }).compile();

        service = module.get(StrategicReportAnalyticsService);
    });

    describe('getByStrategicReportId', () => {
        it('returns analytics after the access check passes', async () => {
            strategicReporting.getById.mockResolvedValue({ id: 10 });
            const rows = [buildAnalytics()];
            analytics.findByStrategicReportId.mockResolvedValue(rows);

            await expect(service.getByStrategicReportId(10)).resolves.toBe(
                rows,
            );
            expect(strategicReporting.getById).toHaveBeenCalledWith(
                10,
                undefined,
            );
        });

        it('throws NotFoundException when the repo returns null', async () => {
            strategicReporting.getById.mockResolvedValue({ id: 10 });
            analytics.findByStrategicReportId.mockResolvedValue(null);

            await expect(
                service.getByStrategicReportId(10),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when missing', async () => {
            analytics.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('re-checks access via the parent strategic report', async () => {
            const row = buildAnalytics(99);
            analytics.findById.mockResolvedValue(row);
            strategicReporting.getById.mockResolvedValue({ id: 99 });

            const result = await service.getById(1);

            expect(strategicReporting.getById).toHaveBeenCalledWith(
                99,
                undefined,
            );
            expect(result).toBe(row);
        });
    });
});
