export enum RespondentSortField {
    ID = 'id',
    REVIEW_ID = 'reviewId',
    RESPONDENT_ID = 'respondentId',
    FULL_NAME = 'fullName',
    CATEGORY = 'category',
    RESPONSE_STATUS = 'responseStatus',
    RESPONDENT_NOTE = 'respondentNote',
    HR_NOTE = 'hrNote',
    POSITION_ID = 'positionId',
    POSITION_TITLE = 'positionTitle',
    TEAM_ID = 'teamId',
    TEAM_TITLE = 'teamTitle',
    INVITED_AT = 'invitedAt',
    CANCELED_AT = 'canceledAt',
    RESPONDED_AT = 'respondedAt',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export const RESPONDENT_SORT_FIELDS = Object.values(RespondentSortField);
