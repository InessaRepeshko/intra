import { EntityType, InsightType } from '@intra/shared-kernel';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { REPORT_INSIGHT_REPOSITORY } from 'src/contexts/reporting/application/ports/report-insight.repository.port';
import { ReportInsightService } from 'src/contexts/reporting/application/services/report-insight.service';
import { ReportingService } from 'src/contexts/reporting/application/services/reports.service';
import { ReportInsightDomain } from 'src/contexts/reporting/domain/report-insight.domain';

function buildInsight(reportId = 10): ReportInsightDomain {
    return ReportInsightDomain.create({
        id: 1,
        reportId,
        insightType: InsightType.HIGHEST_RATING,
        entityType: EntityType.QUESTION,
        questionId: 100,
        questionTitle: 'Q?',
        competenceId: null,
        competenceTitle: null,
    });
}

describe('ReportInsightService', () => {
    let service: ReportInsightService;
    let insights: any;
    let reporting: any;

    beforeEach(async () => {
        insights = {
            findByReportId: jest.fn(),
            findById: jest.fn(),
        };
        reporting = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ReportInsightService,
                { provide: REPORT_INSIGHT_REPOSITORY, useValue: insights },
                { provide: ReportingService, useValue: reporting },
            ],
        }).compile();

        service = module.get(ReportInsightService);
    });

    describe('getByReportId', () => {
        it('returns insights after the access check passes', async () => {
            reporting.getById.mockResolvedValue({ id: 10 });
            const rows = [buildInsight()];
            insights.findByReportId.mockResolvedValue(rows);

            await expect(service.getByReportId(10)).resolves.toBe(rows);
        });

        it('throws NotFoundException when the repo returns null', async () => {
            reporting.getById.mockResolvedValue({ id: 10 });
            insights.findByReportId.mockResolvedValue(null);

            await expect(service.getByReportId(10)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when the insight is missing', async () => {
            insights.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('re-checks access via the parent report', async () => {
            const insight = buildInsight(50);
            insights.findById.mockResolvedValue(insight);
            reporting.getById.mockResolvedValue({ id: 50 });

            const result = await service.getById(1);

            expect(reporting.getById).toHaveBeenCalledWith(50, undefined);
            expect(result).toBe(insight);
        });
    });
});
