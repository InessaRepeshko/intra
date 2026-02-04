import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_REPOSITORY,
    ReportRepositoryPort,
} from '../../application/ports/report.repository.port';
import { ReportDomain } from '../../domain/report.domain';
import { ReportingMapper } from './reporting.mapper';

@Injectable()
export class ReportRepository implements ReportRepositoryPort {
    readonly [REPORT_REPOSITORY] = REPORT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number): Promise<ReportDomain | null> {
        const report = await this.prisma.report.findUnique({
            where: { id },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return report ? ReportingMapper.toReportDomain(report) : null;
    }

    async findByReviewId(reviewId: number): Promise<ReportDomain | null> {
        const report = await this.prisma.report.findUnique({
            where: { reviewId },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return report ? ReportingMapper.toReportDomain(report) : null;
    }

    async create(domain: ReportDomain): Promise<ReportDomain> {
        const created = await this.prisma.report.create({
            data: {
                reviewId: domain.reviewId,
                cycleId: domain.cycleId,
                respondentCount: domain.respondentCount,
                turnoutOfTeam: domain.turnoutOfTeam,
                turnoutOfOther: domain.turnoutOfOther,
                totalAverageBySelfAssessment:
                    domain.totalAverageBySelfAssessment,
                totalAverageByTeam: domain.totalAverageByTeam,
                totalAverageByOthers: domain.totalAverageByOthers,
                totalDeltaBySelfAssessment: domain.totalDeltaBySelfAssessment,
                totalDeltaByTeam: domain.totalDeltaByTeam,
                totalDeltaByOthers: domain.totalDeltaByOthers,
                totalAverageCompetenceBySelfAssessment:
                    domain.totalAverageCompetenceBySelfAssessment,
                totalAverageCompetenceByTeam:
                    domain.totalAverageCompetenceByTeam,
                totalAverageCompetenceByOthers:
                    domain.totalAverageCompetenceByOthers,
                totalCompetencePercentageBySelfAssessment:
                    domain.totalCompetencePercentageBySelfAssessment,
                totalCompetencePercentageByTeam:
                    domain.totalCompetencePercentageByTeam,
                totalCompetencePercentageByOthers:
                    domain.totalCompetencePercentageByOthers,
            },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return ReportingMapper.toReportDomain(created);
    }
}
