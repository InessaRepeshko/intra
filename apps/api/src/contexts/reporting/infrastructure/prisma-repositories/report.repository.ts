import { Prisma } from '@intra/database';
import {
    ReportSearchQuery,
    ReportSortField,
    SortDirection,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REPORT_REPOSITORY,
    ReportRepositoryPort,
} from '../../application/ports/report.repository.port';
import { ReportDomain } from '../../domain/report.domain';
import { ReportMapper } from '../mappers/report.mapper';

@Injectable()
export class ReportRepository implements ReportRepositoryPort {
    readonly [REPORT_REPOSITORY] = REPORT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async search(query: ReportSearchQuery): Promise<ReportDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);
        const items = await this.prisma.report.findMany({ where, orderBy });
        return items.map(ReportMapper.toDomain);
    }

    async create(domain: ReportDomain): Promise<ReportDomain> {
        const created = await this.prisma.report.create({
            data: ReportMapper.toPrisma(domain),
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return ReportMapper.toDomainWithRelations(created);
    }

    async findById(id: number): Promise<ReportDomain | null> {
        const report = await this.prisma.report.findUnique({
            where: { id },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return report ? ReportMapper.toDomainWithRelations(report) : null;
    }

    async findByReviewId(reviewId: number): Promise<ReportDomain | null> {
        const report = await this.prisma.report.findUnique({
            where: { reviewId },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                comments: { orderBy: { id: 'asc' } },
            },
        });

        return report ? ReportMapper.toDomainWithRelations(report) : null;
    }

    private buildWhere(query: ReportSearchQuery): Prisma.ReportWhereInput {
        const {
            reviewId,
            cycleId,
            respondentCount,
            turnoutPctOfTeam,
            turnoutPctOfOther,
            questionTotAvgBySelf,
            questionTotAvgByTeam,
            questionTotAvgByOthers,
            questionTotPctBySelf,
            questionTotPctByTeam,
            questionTotPctByOthers,
            questionTotDeltaPctByTeam,
            questionTotDeltaPctByOthers,
            competenceTotAvgBySelf,
            competenceTotAvgByTeam,
            competenceTotAvgByOthers,
            competenceTotPctBySelf,
            competenceTotPctByTeam,
            competenceTotPctByOthers,
            competenceTotDeltaPctByTeam,
            competenceTotDeltaPctByOthers,
            createdAt,
        } = query;
        return {
            ...(reviewId ? { reviewId } : {}),
            ...(cycleId ? { cycleId } : {}),
            ...(respondentCount ? { respondentCount } : {}),
            ...(turnoutPctOfTeam ? { turnoutPctOfTeam } : {}),
            ...(turnoutPctOfOther ? { turnoutPctOfOther } : {}),
            ...(questionTotAvgBySelf ? { questionTotAvgBySelf } : {}),
            ...(questionTotAvgByTeam ? { questionTotAvgByTeam } : {}),
            ...(questionTotAvgByOthers ? { questionTotAvgByOthers } : {}),
            ...(questionTotPctBySelf ? { questionTotPctBySelf } : {}),
            ...(questionTotPctByTeam ? { questionTotPctByTeam } : {}),
            ...(questionTotPctByOthers ? { questionTotPctByOthers } : {}),
            ...(questionTotDeltaPctByTeam ? { questionTotDeltaPctByTeam } : {}),
            ...(questionTotDeltaPctByOthers
                ? { questionTotDeltaPctByOthers }
                : {}),
            ...(competenceTotAvgBySelf ? { competenceTotAvgBySelf } : {}),
            ...(competenceTotAvgByTeam ? { competenceTotAvgByTeam } : {}),
            ...(competenceTotAvgByOthers ? { competenceTotAvgByOthers } : {}),
            ...(competenceTotPctBySelf ? { competenceTotPctBySelf } : {}),
            ...(competenceTotPctByTeam ? { competenceTotPctByTeam } : {}),
            ...(competenceTotPctByOthers ? { competenceTotPctByOthers } : {}),
            ...(competenceTotDeltaPctByTeam
                ? { competenceTotDeltaPctByTeam }
                : {}),
            ...(competenceTotDeltaPctByOthers
                ? { competenceTotDeltaPctByOthers }
                : {}),
            ...(createdAt ? { createdAt } : {}),
        };
    }

    private buildOrder(
        query: ReportSearchQuery,
    ): Prisma.ReportOrderByWithRelationInput[] {
        const field = query.sortBy ?? ReportSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
