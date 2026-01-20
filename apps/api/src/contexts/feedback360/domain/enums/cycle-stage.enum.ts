export enum CycleStage {
  CANCELED = 'canceled',
  NEW = 'new',
  ACTIVE = 'active',
  FINISHED = 'finished',
  ARCHIVED = 'archived',
}

export const CYCLE_STAGES = Object.values(CycleStage);
