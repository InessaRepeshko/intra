import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    STRATEGIC_REPORT_ANALYTICS_REPOSITORY,
    StrategicReportAnalyticsRepositoryPort,
} from '../../application/ports/strategic-report-analytics.repository.port';
import { StrategicReportAnalyticsDomain } from '../../domain/strategic-report-analytics.domain';
import { StrategicReportAnalyticsMapper } from '../mappers/strategic-report-analytics.mapper';

@Injectable()
export class StrategicReportAnalyticsRepository implements StrategicReportAnalyticsRepositoryPort {
    readonly [STRATEGIC_REPORT_ANALYTICS_REPOSITORY] =
        STRATEGIC_REPORT_ANALYTICS_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async createMany(
        reportId: number,
        analytics: StrategicReportAnalyticsDomain[],
    ): Promise<void> {
        if (analytics.length === 0) {
            return;
        }

        const data = analytics.map((item) =>
            StrategicReportAnalyticsMapper.toPrisma(reportId, item),
        );

        await this.prisma.strategicReportAnalytics.createMany({ data });
    }

    async findByStrategicReportId(
        strategicReportId: number,
    ): Promise<StrategicReportAnalyticsDomain[]> {
        const analytics = await this.prisma.strategicReportAnalytics.findMany({
            where: { strategicReportId },
            orderBy: { id: 'asc' },
        });

        return analytics.map(StrategicReportAnalyticsMapper.toDomain);
    }

    async findById(id: number): Promise<StrategicReportAnalyticsDomain | null> {
        const analytics = await this.prisma.strategicReportAnalytics.findUnique(
            {
                where: { id },
            },
        );

        return analytics
            ? StrategicReportAnalyticsMapper.toDomain(analytics)
            : null;
    }
}
