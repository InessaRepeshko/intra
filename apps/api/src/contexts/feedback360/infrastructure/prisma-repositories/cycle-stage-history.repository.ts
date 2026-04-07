import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    CYCLE_STAGE_HISTORY_REPOSITORY,
    CycleStageHistoryRepositoryPort,
} from '../../application/ports/cycle-stage-history.repository.port';
import { CycleStageHistoryDomain } from '../../domain/cycle-stage-history.domain';
import { CycleStageHistoryMapper } from '../mappers/cycle-stage-history.mapper';

@Injectable()
export class CycleStageHistoryRepository implements CycleStageHistoryRepositoryPort {
    readonly [CYCLE_STAGE_HISTORY_REPOSITORY] = CYCLE_STAGE_HISTORY_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(
        history: CycleStageHistoryDomain,
    ): Promise<CycleStageHistoryDomain> {
        const created = await this.prisma.cycleStageHistory.create({
            data: CycleStageHistoryMapper.toPrisma(history),
        });
        return CycleStageHistoryMapper.toDomain(created);
    }

    async findByCycleId(cycleId: number): Promise<CycleStageHistoryDomain[]> {
        const items = await this.prisma.cycleStageHistory.findMany({
            where: { cycleId },
            orderBy: { createdAt: 'asc' },
        });
        return items.map(CycleStageHistoryMapper.toDomain);
    }

    async findById(id: number): Promise<CycleStageHistoryDomain | null> {
        const item = await this.prisma.cycleStageHistory.findUnique({
            where: { id },
        });
        return item ? CycleStageHistoryMapper.toDomain(item) : null;
    }
}
