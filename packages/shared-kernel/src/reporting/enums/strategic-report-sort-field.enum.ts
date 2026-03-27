export enum StrategicReportSortField {
    ID = 'id',
    CYCLE_ID = 'cycleId',
    RATEE_COUNT = 'rateeCount',
    RESPONDENT_COUNT = 'respondentCount',
    ANSWER_COUNT = 'answerCount',
    REVIEWER_COUNT = 'reviewerCount',
    TEAM_COUNT = 'teamCount',
    POSITION_COUNT = 'positionCount',
    COMPETENCE_COUNT = 'competenceCount',
    QUESTION_COUNT = 'questionCount',
    TURNOUT_PCT_OF_RATEES = 'turnoutPctOfRatees',
    TURNOUT_PCT_OF_RESPONDENTS = 'turnoutPctOfRespondents',
    COMPETENCE_GENERAL_AVG_SELF = 'competenceGeneralAvgSelf',
    COMPETENCE_GENERAL_AVG_TEAM = 'competenceGeneralAvgTeam',
    COMPETENCE_GENERAL_AVG_OTHER = 'competenceGeneralAvgOther',
    COMPETENCE_GENERAL_PCT_SELF = 'competenceGeneralPctSelf',
    COMPETENCE_GENERAL_PCT_TEAM = 'competenceGeneralPctTeam',
    COMPETENCE_GENERAL_PCT_OTHER = 'competenceGeneralPctOther',
    COMPETENCE_GENERAL_DELTA_TEAM = 'competenceGeneralDeltaTeam',
    COMPETENCE_GENERAL_DELTA_OTHER = 'competenceGeneralDeltaOther',
    CREATED_AT = 'createdAt',
}

export const STRATEGIC_REPORT_SOFT_FIELDS = Object.values(
    StrategicReportSortField,
);
