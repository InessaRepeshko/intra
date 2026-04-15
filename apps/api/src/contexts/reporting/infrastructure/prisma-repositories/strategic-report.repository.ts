import { Prisma } from '@intra/database';
import {
    SortDirection,
    StrategicReportSearchQuery,
    StrategicReportSortField,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    STRATEGIC_REPORT_REPOSITORY,
    StrategicReportRepositoryPort,
} from '../../application/ports/strategic-report.repository.port';
import { StrategicReportDomain } from '../../domain/strategic-report.domain';
import { StrategicReportMapper } from '../mappers/strategic-report.mapper';

@Injectable()
export class StrategicReportRepository implements StrategicReportRepositoryPort {
    readonly [STRATEGIC_REPORT_REPOSITORY] = STRATEGIC_REPORT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async search(
        query: StrategicReportSearchQuery,
    ): Promise<StrategicReportDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);
        const items = await this.prisma.strategicReport.findMany({
            where,
            orderBy,
        });
        return items.map(StrategicReportMapper.toDomain);
    }

    async create(
        domain: StrategicReportDomain,
    ): Promise<StrategicReportDomain> {
        const created = await this.prisma.strategicReport.create({
            data: StrategicReportMapper.toPrisma(domain),
            include: {
                analytics: { orderBy: { id: 'asc' } },
                insights: { orderBy: { id: 'asc' } },
            },
        });

        return StrategicReportMapper.toDomainWithRelations(created);
    }

    async findById(id: number): Promise<StrategicReportDomain | null> {
        const report = await this.prisma.strategicReport.findUnique({
            where: { id },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                insights: { orderBy: { id: 'asc' } },
            },
        });

        return report
            ? StrategicReportMapper.toDomainWithRelations(report)
            : null;
    }

    async findByCycleId(
        cycleId: number,
    ): Promise<StrategicReportDomain | null> {
        const report = await this.prisma.strategicReport.findFirst({
            where: { cycleId },
            include: {
                analytics: { orderBy: { id: 'asc' } },
                insights: { orderBy: { id: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });

        return report
            ? StrategicReportMapper.toDomainWithRelations(report)
            : null;
    }

    private buildWhere(
        query: StrategicReportSearchQuery,
    ): Prisma.StrategicReportWhereInput {
        const {
            cycleId,
            cycleTitle,
            rateeCount,
            rateeIds,
            respondentCount,
            respondentIds,
            answerCount,
            reviewerCount,
            reviewerIds,
            teamCount,
            teamIds,
            positionCount,
            positionIds,
            competenceCount,
            competenceIds,
            questionCount,
            questionIds,
            turnoutAvgPctOfRatees,
            turnoutAvgPctOfTeams,
            turnoutAvgPctOfOthers,
            competenceGeneralAvgSelf,
            competenceGeneralAvgTeam,
            competenceGeneralAvgOther,
            competenceGeneralPctSelf,
            competenceGeneralPctTeam,
            competenceGeneralPctOther,
            competenceGeneralDeltaTeam,
            competenceGeneralDeltaOther,
            createdAt,
        } = query;
        return {
            ...(cycleId ? { cycleId } : {}),
            ...(cycleTitle ? { cycleTitle } : {}),
            ...(rateeIds ? { rateeIds: { hasSome: rateeIds } } : {}),
            ...(rateeCount ? { rateeCount } : {}),
            ...(respondentIds
                ? { respondentIds: { hasSome: respondentIds } }
                : {}),
            ...(respondentCount ? { respondentCount } : {}),
            ...(answerCount ? { answerCount } : {}),
            ...(reviewerIds ? { reviewerIds: { hasSome: reviewerIds } } : {}),
            ...(reviewerCount ? { reviewerCount } : {}),
            ...(teamIds ? { teamIds: { hasSome: teamIds } } : {}),
            ...(teamCount ? { teamCount } : {}),
            ...(positionIds ? { positionIds: { hasSome: positionIds } } : {}),
            ...(positionCount ? { positionCount } : {}),
            ...(competenceIds
                ? { competenceIds: { hasSome: competenceIds } }
                : {}),
            ...(competenceCount ? { competenceCount } : {}),
            ...(questionIds ? { questionIds: { hasSome: questionIds } } : {}),
            ...(questionCount ? { questionCount } : {}),
            ...(turnoutAvgPctOfRatees ? { turnoutAvgPctOfRatees } : {}),
            ...(turnoutAvgPctOfTeams ? { turnoutAvgPctOfTeams } : {}),
            ...(turnoutAvgPctOfOthers ? { turnoutAvgPctOfOthers } : {}),
            ...(createdAt ? { createdAt } : {}),
            ...(competenceGeneralAvgSelf ? { competenceGeneralAvgSelf } : {}),
            ...(competenceGeneralAvgTeam ? { competenceGeneralAvgTeam } : {}),
            ...(competenceGeneralAvgOther ? { competenceGeneralAvgOther } : {}),
            ...(competenceGeneralPctSelf ? { competenceGeneralPctSelf } : {}),
            ...(competenceGeneralPctTeam ? { competenceGeneralPctTeam } : {}),
            ...(competenceGeneralPctOther ? { competenceGeneralPctOther } : {}),
            ...(competenceGeneralDeltaTeam
                ? { competenceGeneralDeltaTeam }
                : {}),
            ...(competenceGeneralDeltaOther
                ? { competenceGeneralDeltaOther }
                : {}),
        };
    }

    private buildOrder(
        query: StrategicReportSearchQuery,
    ): Prisma.StrategicReportOrderByWithRelationInput[] {
        const field = query.sortBy ?? StrategicReportSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
