import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import {
    REPORT_ANALYTICS_REPOSITORY,
    ReportAnalyticsRepositoryPort,
} from '../ports/report-analytics.repository.port';

@Injectable()
export class ReportAnalyticsService {
    constructor(
        @Inject(REPORT_ANALYTICS_REPOSITORY)
        private readonly analytics: ReportAnalyticsRepositoryPort,
    ) {}

    async getByReportId(reportId: number): Promise<ReportAnalyticsDomain[]> {
        return this.analytics.findByReportId(reportId);
    }

    async getById(id: number): Promise<ReportAnalyticsDomain> {
        const analytics = await this.analytics.findById(id);
        if (!analytics) {
            throw new NotFoundException(
                `Report analytics with id ${id} was not found`,
            );
        }

        return analytics;
    }
}
