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
                turnoutPctOfTeam: this.toDecimalString(domain.turnoutPctOfTeam),
                turnoutPctOfOther: this.toDecimalString(
                    domain.turnoutPctOfOther,
                ),
                questionTotAvgBySelf: this.toDecimalString(
                    domain.questionTotAvgBySelf,
                ),
                questionTotAvgByTeam: this.toDecimalString(
                    domain.questionTotAvgByTeam,
                ),
                questionTotAvgByOthers: this.toDecimalString(
                    domain.questionTotAvgByOthers,
                ),
                questionTotPctBySelf: this.toDecimalString(
                    domain.questionTotPctBySelf,
                ),
                questionTotPctByTeam: this.toDecimalString(
                    domain.questionTotPctByTeam,
                ),
                questionTotPctByOthers: this.toDecimalString(
                    domain.questionTotPctByOthers,
                ),
                questionTotDeltaPctByTeam: this.toDecimalString(
                    domain.questionTotDeltaPctByTeam,
                ),
                questionTotDeltaPctByOthers: this.toDecimalString(
                    domain.questionTotDeltaPctByOthers,
                ),
                competenceTotAvgBySelf: this.toDecimalString(
                    domain.competenceTotAvgBySelf,
                ),
                competenceTotAvgByTeam: this.toDecimalString(
                    domain.competenceTotAvgByTeam,
                ),
                competenceTotAvgByOthers: this.toDecimalString(
                    domain.competenceTotAvgByOthers,
                ),
                competenceTotPctBySelf: this.toDecimalString(
                    domain.competenceTotPctBySelf,
                ),
                competenceTotPctByTeam: this.toDecimalString(
                    domain.competenceTotPctByTeam,
                ),
                competenceTotPctByOthers: this.toDecimalString(
                    domain.competenceTotPctByOthers,
                ),
                competenceTotDeltaPctByTeam: this.toDecimalString(
                    domain.competenceTotDeltaPctByTeam,
                ),
                competenceTotDeltaPctByOthers: this.toDecimalString(
                    domain.competenceTotDeltaPctByOthers,
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
