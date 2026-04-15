import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ReportInsightDomain } from '../../domain/report-insight.domain';
import {
    REPORT_INSIGHT_REPOSITORY,
    ReportInsightRepositoryPort,
} from '../ports/report-insight.repository.port';
import { ReportingService } from './reports.service';

@Injectable()
export class ReportInsightService {
    constructor(
        @Inject(REPORT_INSIGHT_REPOSITORY)
        private readonly insights: ReportInsightRepositoryPort,
        private readonly reportingService: ReportingService,
    ) {}

    async getByReportId(
        reportId: number,
        actor?: UserDomain,
    ): Promise<ReportInsightDomain[]> {
        await this.reportingService.getById(reportId, actor);

        const insights = await this.insights.findByReportId(reportId);

        if (!insights) {
            throw new NotFoundException(
                `Report insights with report id ${reportId} was not found`,
            );
        }

        return insights;
    }

    async getById(
        id: number,
        actor?: UserDomain,
    ): Promise<ReportInsightDomain> {
        const insight = await this.insights.findById(id);

        if (!insight) {
            throw new NotFoundException(
                `Report insight with id ${id} was not found`,
            );
        }

        await this.reportingService.getById(insight.reportId, actor);

        return insight;
    }
}
