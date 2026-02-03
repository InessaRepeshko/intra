import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_ANALYTICS_REPOSITORY,
    ReportAnalyticsRepositoryPort,
} from '../../application/ports/report-analytics.repository.port';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import { ReportingMapper } from './reporting.mapper';

@Injectable()
export class ReportAnalyticsRepository implements ReportAnalyticsRepositoryPort {
    readonly [REPORT_ANALYTICS_REPOSITORY] = REPORT_ANALYTICS_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async findByReportId(reportId: number): Promise<ReportAnalyticsDomain[]> {
        const analytics = await this.prisma.reportAnalytics.findMany({
            where: { reportId },
            orderBy: { id: 'asc' },
        });

        return analytics.map(ReportingMapper.toReportAnalyticsDomain);
    }

    async findById(id: number): Promise<ReportAnalyticsDomain | null> {
        const analytics = await this.prisma.reportAnalytics.findUnique({
            where: { id },
        });

        return analytics
            ? ReportingMapper.toReportAnalyticsDomain(analytics)
            : null;
    }
}
