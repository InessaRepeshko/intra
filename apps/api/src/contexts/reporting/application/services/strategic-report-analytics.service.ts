import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { StrategicReportAnalyticsDomain } from '../../domain/strategic-report-analytics.domain';
import {
    STRATEGIC_REPORT_ANALYTICS_REPOSITORY,
    StrategicReportAnalyticsRepositoryPort,
} from '../ports/strategic-report-analytics.repository.port';
import { StrategicReportingService } from './strategic-reports.service';

@Injectable()
export class StrategicReportAnalyticsService {
    constructor(
        @Inject(STRATEGIC_REPORT_ANALYTICS_REPOSITORY)
        private readonly strategicAnalytics: StrategicReportAnalyticsRepositoryPort,
        private readonly strategicReportingService: StrategicReportingService,
    ) {}

    async getByStrategicReportId(
        strategicReportId: number,
        actor?: UserDomain,
    ): Promise<StrategicReportAnalyticsDomain[]> {
        await this.strategicReportingService.getById(strategicReportId, actor);

        const strategicAnalytics =
            await this.strategicAnalytics.findByStrategicReportId(
                strategicReportId,
            );

        if (!strategicAnalytics) {
            throw new NotFoundException(
                `Strategic report analytics with report id ${strategicReportId} was not found`,
            );
        }

        return strategicAnalytics;
    }

    async getById(
        id: number,
        actor?: UserDomain,
    ): Promise<StrategicReportAnalyticsDomain> {
        const strategicAnalytics = await this.strategicAnalytics.findById(id);

        if (!strategicAnalytics) {
            throw new NotFoundException(
                `Strategic report analytics with id ${id} was not found`,
            );
        }

        await this.strategicReportingService.getById(
            strategicAnalytics.strategicReportId,
            actor,
        );

        return strategicAnalytics;
    }
}
