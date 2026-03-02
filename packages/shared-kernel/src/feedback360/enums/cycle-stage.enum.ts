export enum CycleStage {
    NEW = 'NEW',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
    CANCELED = 'CANCELED',
    ARCHIVED = 'ARCHIVED',
}

export const CYCLE_STAGES = Object.values(CycleStage);
