import { CycleStageHistoryDomain } from '../../domain/cycle-stage-history.domain';

export const CYCLE_STAGE_HISTORY_REPOSITORY = Symbol(
    'FEEDBACK360.CYCLE_STAGE_HISTORY_REPOSITORY',
);

export interface CycleStageHistoryRepositoryPort {
    create(history: CycleStageHistoryDomain): Promise<CycleStageHistoryDomain>;
    findByCycleId(cycleId: number): Promise<CycleStageHistoryDomain[]>;
    findById(id: number): Promise<CycleStageHistoryDomain | null>;
}
