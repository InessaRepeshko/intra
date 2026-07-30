import { InsightType } from '@intra/shared-kernel';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { STRATEGIC_REPORT_INSIGHT_REPOSITORY } from 'src/contexts/reporting/application/ports/strategic-report-insight.repository.port';
import { StartegicReportInsightService } from 'src/contexts/reporting/application/services/startegic-report-insight.service';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
import { StrategicReportInsightDomain } from 'src/contexts/reporting/domain/startegic-report-insight.domain';

function buildInsight(strategicReportId = 10): StrategicReportInsightDomain {
    return StrategicReportInsightDomain.create({
        id: 1,
        strategicReportId,
        insightType: InsightType.HIGHEST_RATING,
        competenceId: 7,
        competenceTitle: 'Teamwork',
    });
}

describe('StartegicReportInsightService', () => {
    let service: StartegicReportInsightService;
    let insights: any;
    let strategicReporting: any;

    beforeEach(async () => {
        insights = {
            findByStrategicReportId: jest.fn(),
            findById: jest.fn(),
        };
        strategicReporting = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                StartegicReportInsightService,
                {
                    provide: STRATEGIC_REPORT_INSIGHT_REPOSITORY,
                    useValue: insights,
                },
                {
                    provide: StrategicReportingService,
                    useValue: strategicReporting,
                },
            ],
        }).compile();

        service = module.get(StartegicReportInsightService);
    });

    describe('getByStrategicReportId', () => {
        it('returns insights after the access check passes', async () => {
            strategicReporting.getById.mockResolvedValue({ id: 10 });
            const rows = [buildInsight()];
            insights.findByStrategicReportId.mockResolvedValue(rows);

            await expect(service.getByStrategicReportId(10)).resolves.toBe(
                rows,
            );
        });

        it('throws NotFoundException when the repo returns null', async () => {
            strategicReporting.getById.mockResolvedValue({ id: 10 });
            insights.findByStrategicReportId.mockResolvedValue(null);

            await expect(
                service.getByStrategicReportId(10),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when missing', async () => {
            insights.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('re-checks access via the parent strategic report', async () => {
            const row = buildInsight(50);
            insights.findById.mockResolvedValue(row);
            strategicReporting.getById.mockResolvedValue({ id: 50 });

            const result = await service.getById(1);

            expect(strategicReporting.getById).toHaveBeenCalledWith(
                50,
                undefined,
            );
            expect(result).toBe(row);
        });
    });
});
