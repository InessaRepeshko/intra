export enum ReviewSortField {
    ID = 'id',
    RATEE_ID = 'rateeId',
    RATEE_FULL_NAME = 'rateeFullName',
    RATEE_POSITION_ID = 'rateePositionId',
    RATEE_POSITION_TITLE = 'rateePositionTitle',
    HR_ID = 'hrId',
    HR_FULL_NAME = 'hrFullName',
    HR_NOTE = 'hrNote',
    TEAM_ID = 'teamId',
    TEAM_TITLE = 'teamTitle',
    MANAGER_ID = 'managerId',
    MANAGER_FULL_NAME = 'managerFullName',
    MANAGER_POSITION_ID = 'managerPositionId',
    MANAGER_POSITION_TITLE = 'managerPositionTitle',
    CYCLE_ID = 'cycleId',
    STAGE = 'stage',
    REPORT_ID = 'reportId',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export const REVIEW_SORT_FIELDS = Object.values(ReviewSortField);
