export enum ReviewStage {
  CANCELED = 'canceled',
  VERIFICATION_BY_HR = 'verification_by_hr',
  VERIFICATION_BY_USER = 'verification_by_user',
  REJECTED = 'rejected',
  SELF_ASSESSMENT = 'self_assessment',
  WAITING_TO_START = 'waiting_to_start',
  IN_PROGRESS = 'in_progress',
  RESEARCH = 'research',
  FINISHED = 'finished',
}

export const REVIEW_STAGES = Object.values(ReviewStage);
