export enum CycleStage {
  CANCELED = 'canceled',
  NEW = 'new',
  ACTIVE = 'active',
  FINISHED = 'finished',
  ARCHIVE = 'archive',
}

export const CYCLE_STAGES = Object.values(CycleStage);
