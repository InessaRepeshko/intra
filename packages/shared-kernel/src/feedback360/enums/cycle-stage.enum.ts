export enum CycleStage {
    CANCELED = 'CANCELED',
    NEW = 'NEW',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
    ARCHIVED = 'ARCHIVED',
}

export const CYCLE_STAGES = Object.values(CycleStage);
