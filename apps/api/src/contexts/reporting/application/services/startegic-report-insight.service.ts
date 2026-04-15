import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { StrategicReportInsightDomain } from '../../domain/startegic-report-insight.domain';
import {
    STRATEGIC_REPORT_INSIGHT_REPOSITORY,
    StrategicReportInsightRepositoryPort,
} from '../ports/strategic-report-insight.repository.port';
import { StrategicReportingService } from './strategic-reports.service';

@Injectable()
export class StartegicReportInsightService {
    constructor(
        @Inject(STRATEGIC_REPORT_INSIGHT_REPOSITORY)
        private readonly insights: StrategicReportInsightRepositoryPort,
        private readonly reportingService: StrategicReportingService,
    ) {}

    async getByStrategicReportId(
        strategicReportId: number,
        actor?: UserDomain,
    ): Promise<StrategicReportInsightDomain[]> {
        await this.reportingService.getById(strategicReportId, actor);

        const insights =
            await this.insights.findByStrategicReportId(strategicReportId);

        if (!insights) {
            throw new NotFoundException(
                `Report insights with strategic report id ${strategicReportId} was not found`,
            );
        }

        return insights;
    }

    async getById(
        id: number,
        actor?: UserDomain,
    ): Promise<StrategicReportInsightDomain> {
        const insight = await this.insights.findById(id);

        if (!insight) {
            throw new NotFoundException(
                `Report insight with id ${id} was not found`,
            );
        }

        await this.reportingService.getById(insight.strategicReportId, actor);

        return insight;
    }
}
