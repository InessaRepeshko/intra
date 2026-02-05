import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
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
                turnoutOfTeam: this.toDecimalString(domain.turnoutOfTeam),
                turnoutOfOther: this.toDecimalString(domain.turnoutOfOther),
                totalAverageBySelfAssessment: this.toDecimalString(
                    domain.totalAverageBySelfAssessment,
                ),
                totalAverageByTeam: this.toDecimalString(
                    domain.totalAverageByTeam,
                ),
                totalAverageByOthers: this.toDecimalString(
                    domain.totalAverageByOthers,
                ),
                totalDeltaByTeam: this.toDecimalString(domain.totalDeltaByTeam),
                totalDeltaByOthers: this.toDecimalString(
                    domain.totalDeltaByOthers,
                ),
                totalAverageCompetenceBySelfAssessment: this.toDecimalString(
                    domain.totalAverageCompetenceBySelfAssessment,
                ),
                totalAverageCompetenceByTeam: this.toDecimalString(
                    domain.totalAverageCompetenceByTeam,
                ),
                totalAverageCompetenceByOthers: this.toDecimalString(
                    domain.totalAverageCompetenceByOthers,
                ),
                totalCompetencePercentageBySelfAssessment: this.toDecimalString(
                    domain.totalCompetencePercentageBySelfAssessment,
                ),
                totalCompetencePercentageByTeam: this.toDecimalString(
                    domain.totalCompetencePercentageByTeam,
                ),
                totalCompetencePercentageByOthers: this.toDecimalString(
                    domain.totalCompetencePercentageByOthers,
                ),
            },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return ReportingMapper.toReportDomain(created);
    }

    private toDecimalString(
        value: Decimal.Value | null | undefined,
    ): string | undefined {
        if (value === null || value === undefined) return undefined;
        return new Decimal(value).toDecimalPlaces(4).toFixed(4);
    }
}
