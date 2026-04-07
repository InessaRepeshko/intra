import {
    Prisma,
    CycleStageHistory as PrismaCycleStageHistory,
} from '@intra/database';
import { CycleStageHistoryDomain } from '../../domain/cycle-stage-history.domain';
import { CycleMapper } from './cycle.mapper';

export class CycleStageHistoryMapper {
    static toDomain(history: PrismaCycleStageHistory): CycleStageHistoryDomain {
        return CycleStageHistoryDomain.create({
            id: history.id,
            cycleId: history.cycleId,
            fromStage: CycleMapper.fromPrismaStage(history.fromStage),
            toStage: CycleMapper.fromPrismaStage(history.toStage),
            changedById: history.changedById,
            changedByName: history.changedByName,
            reason: history.reason,
            createdAt: history.createdAt,
        });
    }

    static toPrisma(
        history: CycleStageHistoryDomain,
    ): Prisma.CycleStageHistoryUncheckedCreateInput {
        return {
            cycleId: history.cycleId,
            fromStage: CycleMapper.toPrismaStage(history.fromStage),
            toStage: CycleMapper.toPrismaStage(history.toStage),
            changedById: history.changedById,
            changedByName: history.changedByName,
            reason: history.reason,
        };
    }
}
