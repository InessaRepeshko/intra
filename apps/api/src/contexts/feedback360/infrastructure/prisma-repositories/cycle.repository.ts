import { Prisma } from '@intra/database';
import {
    CycleSearchQuery,
    CycleSortField,
    SortDirection,
    UpdateCyclePayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    CYCLE_REPOSITORY,
    CycleRepositoryPort,
} from '../../application/ports/cycle.repository.port';
import { CycleDomain } from '../../domain/cycle.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class CycleRepository implements CycleRepositoryPort {
    readonly [CYCLE_REPOSITORY] = CYCLE_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(cycle: CycleDomain): Promise<CycleDomain> {
        const created = await this.prisma.cycle.create({
            data: {
                title: cycle.title,
                description: cycle.description,
                hrId: cycle.hrId,
                minRespondentsThreshold: cycle.minRespondentsThreshold,
                stage: Feedback360Mapper.toPrismaCycleStage(cycle.stage),
                isActive: cycle.isActive,
                startDate: cycle.startDate,
                reviewDeadline: cycle.reviewDeadline,
                approvalDeadline: cycle.approvalDeadline,
                responseDeadline: cycle.responseDeadline,
                endDate: cycle.endDate,
            },
        });

        return Feedback360Mapper.toCycleDomain(created);
    }

    async findById(id: number): Promise<CycleDomain | null> {
        const cycle = await this.prisma.cycle.findUnique({ where: { id } });
        return cycle ? Feedback360Mapper.toCycleDomain(cycle) : null;
    }

    async search(query: CycleSearchQuery): Promise<CycleDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);

        const items = await this.prisma.cycle.findMany({
            where,
            orderBy,
        });

        return items.map(Feedback360Mapper.toCycleDomain);
    }

    async updateById(
        id: number,
        patch: UpdateCyclePayload,
    ): Promise<CycleDomain> {
        const updated = await this.prisma.cycle.update({
            where: { id },
            data: {
                ...patch,
                ...(patch.stage
                    ? {
                          stage: Feedback360Mapper.toPrismaCycleStage(
                              patch.stage,
                          ),
                      }
                    : {}),
            },
        });
        return Feedback360Mapper.toCycleDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.cycle.delete({ where: { id } });
    }

    private buildWhere(query: CycleSearchQuery): Prisma.CycleWhereInput {
        const {
            title,
            description,
            hrId,
            stage,
            isActive,
            search,
            minRespondentsThreshold,
            startDate,
            reviewDeadline,
            approvalDeadline,
            responseDeadline,
            endDate,
        } = query;
        return {
            ...(title
                ? { title: { contains: title, mode: 'insensitive' } }
                : {}),
            ...(description
                ? {
                      description: {
                          contains: description,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(search
                ? {
                      OR: [
                          { title: { contains: search, mode: 'insensitive' } },
                          {
                              description: {
                                  contains: search,
                                  mode: 'insensitive',
                              },
                          },
                      ],
                  }
                : {}),
            ...(hrId ? { hrId } : {}),
            ...(minRespondentsThreshold ? { minRespondentsThreshold } : {}),
            ...(stage
                ? { stage: Feedback360Mapper.toPrismaCycleStage(stage) }
                : {}),
            ...(isActive !== undefined ? { isActive } : {}),
            ...(startDate ? { startDate } : {}),
            ...(reviewDeadline ? { reviewDeadline } : {}),
            ...(approvalDeadline ? { approvalDeadline } : {}),
            ...(responseDeadline ? { responseDeadline } : {}),
            ...(endDate ? { endDate } : {}),
        };
    }

    private buildOrder(
        query: CycleSearchQuery,
    ): Prisma.CycleOrderByWithRelationInput[] {
        const field = query.sortBy ?? CycleSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
