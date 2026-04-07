export enum CycleStage {
    NEW = 'NEW',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
    PREPARING_REPORT = 'PREPARING_REPORT',
    PUBLISHED = 'PUBLISHED',
    CANCELED = 'CANCELED',
    ARCHIVED = 'ARCHIVED',
}

export const CYCLE_STAGES = Object.values(CycleStage);
