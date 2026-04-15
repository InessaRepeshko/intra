import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_INSIGHT_REPOSITORY,
    ReportInsightRepositoryPort,
} from '../../application/ports/report-insight.repository.port';
import { ReportInsightDomain } from '../../domain/report-insight.domain';
import { ReportInsightMapper } from '../mappers/report-insight.mapper';

@Injectable()
export class ReportInsightRepository implements ReportInsightRepositoryPort {
    readonly [REPORT_INSIGHT_REPOSITORY] = REPORT_INSIGHT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async createMany(
        reportId: number,
        insights: ReportInsightDomain[],
    ): Promise<void> {
        if (insights.length === 0) {
            return;
        }

        const data = insights.map((item) =>
            ReportInsightMapper.toPrisma(reportId, item),
        );

        await this.prisma.reportInsights.createMany({ data });
    }

    async findByReportId(reportId: number): Promise<ReportInsightDomain[]> {
        const analytics = await this.prisma.reportInsights.findMany({
            where: { reportId },
            orderBy: { id: 'asc' },
        });

        return analytics.map(ReportInsightMapper.toDomain);
    }

    async findById(id: number): Promise<ReportInsightDomain | null> {
        const analytics = await this.prisma.reportInsights.findUnique({
            where: { id },
        });

        return analytics ? ReportInsightMapper.toDomain(analytics) : null;
    }
}
