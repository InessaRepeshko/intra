export enum ReportAnalyticsSortField {
    ID = 'id',
    REPORT_ID = 'reportId',
    ENTITY_TYPE = 'entityType',
    QUESTION_ID = 'questionId',
    QUESTION_TITLE = 'questionTitle',
    COMPETENCE_ID = 'competenceId',
    COMPETENCE_TITLE = 'competenceTitle',
    AVERAGE_BY_SELF_ASSESSMENT = 'averageBySelfAssessment',
    AVERAGE_BY_TEAM = 'averageByTeam',
    AVERAGE_BY_OTHER = 'averageByOther',
    PERCENTAGE_BY_SELF_ASSESSMENT = 'percentageBySelfAssessment',
    PERCENTAGE_BY_TEAM = 'percentageByTeam',
    PERCENTAGE_BY_OTHER = 'percentageByOther',
    DELTA_PERCENTAGE_BY_TEAM = 'deltaPercentageByTeam',
    DELTA_PERCENTAGE_BY_OTHER = 'deltaPercentageByOther',
    CREATED_AT = 'createdAt',
}

export const REPORT_ANALYTICS_SORT_FIELDS = Object.values(
    ReportAnalyticsSortField,
);
