import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_ANALYTICS_REPOSITORY,
    ReportAnalyticsRepositoryPort,
} from '../../application/ports/report-analytics.repository.port';
import { ReportAnalyticsDomain } from '../../domain/report-analytics.domain';
import { ReportAnalyticsMapper } from '../mappers/report-analytics.mapper';

@Injectable()
export class ReportAnalyticsRepository implements ReportAnalyticsRepositoryPort {
    readonly [REPORT_ANALYTICS_REPOSITORY] = REPORT_ANALYTICS_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async createMany(
        reportId: number,
        analytics: ReportAnalyticsDomain[],
    ): Promise<void> {
        if (analytics.length === 0) {
            return;
        }

        const data = analytics.map((item) =>
            ReportAnalyticsMapper.toPrisma(reportId, item),
        );

        await this.prisma.reportAnalytics.createMany({ data });
    }

    async findByReportId(reportId: number): Promise<ReportAnalyticsDomain[]> {
        const analytics = await this.prisma.reportAnalytics.findMany({
            where: { reportId },
            orderBy: { id: 'asc' },
        });

        return analytics.map(ReportAnalyticsMapper.toDomain);
    }

    async findById(id: number): Promise<ReportAnalyticsDomain | null> {
        const analytics = await this.prisma.reportAnalytics.findUnique({
            where: { id },
        });

        return analytics ? ReportAnalyticsMapper.toDomain(analytics) : null;
    }
}
