export enum QuestionSortField {
    ID = 'id',
    CYCLE_ID = 'cycleId',
    QUESTION_TEMPLATE_ID = 'questionTemplateId',
    TITLE = 'title',
    ANSWER_TYPE = 'answerType',
    COMPETENCE_ID = 'competenceId',
    IS_FOR_SELFASSESSMENT = 'isForSelfassessment',
    CREATED_AT = 'createdAt',
}

export const QUESTION_SORT_FIELDS = Object.values(QuestionSortField);