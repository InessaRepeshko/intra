import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    STRATEGIC_REPORT_INSIGHT_REPOSITORY,
    StrategicReportInsightRepositoryPort,
} from '../../application/ports/strategic-report-insight.repository.port';
import { StrategicReportInsightDomain } from '../../domain/startegic-report-insight.domain';
import { StrategicReportInsightMapper } from '../mappers/strategic-report-insight.mapper';

@Injectable()
export class StrategicReportInsightRepository implements StrategicReportInsightRepositoryPort {
    readonly [STRATEGIC_REPORT_INSIGHT_REPOSITORY] =
        STRATEGIC_REPORT_INSIGHT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async createMany(
        strategicReportId: number,
        insights: StrategicReportInsightDomain[],
    ): Promise<void> {
        if (insights.length === 0) {
            return;
        }

        const data = insights.map((item) =>
            StrategicReportInsightMapper.toPrisma(strategicReportId, item),
        );

        await this.prisma.strategicReportInsights.createMany({ data });
    }

    async findByStrategicReportId(
        reportId: number,
    ): Promise<StrategicReportInsightDomain[]> {
        const analytics = await this.prisma.strategicReportInsights.findMany({
            where: { strategicReportId: reportId },
            orderBy: { id: 'asc' },
        });

        return analytics.map(StrategicReportInsightMapper.toDomain);
    }

    async findById(id: number): Promise<StrategicReportInsightDomain | null> {
        const analytics = await this.prisma.strategicReportInsights.findUnique({
            where: { id },
        });

        return analytics
            ? StrategicReportInsightMapper.toDomain(analytics)
            : null;
    }
}
