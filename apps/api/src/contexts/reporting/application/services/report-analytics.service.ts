import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import {
    REPORT_ANALYTICS_REPOSITORY,
    ReportAnalyticsRepositoryPort,
} from '../ports/report-analytics.repository.port';
import { ReportingService } from './reporting.service';

@Injectable()
export class ReportAnalyticsService {
    constructor(
        @Inject(REPORT_ANALYTICS_REPOSITORY)
        private readonly analytics: ReportAnalyticsRepositoryPort,
        private readonly reportingService: ReportingService,
    ) {}

    async getByReportId(
        reportId: number,
        actor?: UserDomain,
    ): Promise<ReportAnalyticsDomain[]> {
        await this.reportingService.getById(reportId, actor);

        const analytics = await this.analytics.findByReportId(reportId);

        if (!analytics) {
            throw new NotFoundException(
                `Report analytics with report id ${reportId} was not found`,
            );
        }

        return analytics;
    }

    async getById(
        id: number,
        actor?: UserDomain,
    ): Promise<ReportAnalyticsDomain> {
        const analytics = await this.analytics.findById(id);

        if (!analytics) {
            throw new NotFoundException(
                `Report analytics with id ${id} was not found`,
            );
        }

        await this.reportingService.getById(analytics.reportId, actor);

        return analytics;
    }
}
