import { EntityType } from '@intra/shared-kernel';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { REPORT_ANALYTICS_REPOSITORY } from 'src/contexts/reporting/application/ports/report-analytics.repository.port';
import { ReportAnalyticsService } from 'src/contexts/reporting/application/services/report-analytics.service';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';
import { ReportAnalyticsDomain } from 'src/contexts/reporting/domain/report-analytics.domain';

function buildAnalytics(reportId = 10): ReportAnalyticsDomain {
    return ReportAnalyticsDomain.create({
        id: 1,
        reportId,
        entityType: EntityType.QUESTION,
        questionId: 100,
        questionTitle: 'Q?',
        competenceId: null,
        competenceTitle: null,
    });
}

describe('ReportAnalyticsService', () => {
    let service: ReportAnalyticsService;
    let analytics: any;
    let reporting: any;

    beforeEach(async () => {
        analytics = {
            findByReportId: jest.fn(),
            findById: jest.fn(),
        };
        reporting = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ReportAnalyticsService,
                { provide: REPORT_ANALYTICS_REPOSITORY, useValue: analytics },
                { provide: ReportingService, useValue: reporting },
            ],
        }).compile();

        service = module.get(ReportAnalyticsService);
    });

    describe('getByReportId', () => {
        it('returns analytics after the access check passes', async () => {
            reporting.getById.mockResolvedValue({ id: 10 });
            const rows = [buildAnalytics()];
            analytics.findByReportId.mockResolvedValue(rows);

            await expect(service.getByReportId(10)).resolves.toBe(rows);
            expect(reporting.getById).toHaveBeenCalledWith(10, undefined);
        });

        it('throws NotFoundException when repository returns null', async () => {
            reporting.getById.mockResolvedValue({ id: 10 });
            analytics.findByReportId.mockResolvedValue(null);

            await expect(service.getByReportId(10)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when the analytics row is missing', async () => {
            analytics.findById.mockResolvedValue(null);

            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('re-checks access via the parent report', async () => {
            const row = buildAnalytics(99);
            analytics.findById.mockResolvedValue(row);
            reporting.getById.mockResolvedValue({ id: 99 });

            const result = await service.getById(1);

            expect(reporting.getById).toHaveBeenCalledWith(99, undefined);
            expect(result).toBe(row);
        });
    });
});
