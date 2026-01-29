export enum QuestionTemplateSortField {
    ID = 'id',
    TITLE = 'title',
    ANSWER_TYPE = 'answerType',
    COMPELTECE_ID = 'competenceId',
    IS_FOR_SELFASSESSMENT = 'isForSelfassessment',
    STATUS = 'status',
    POSITION_IDS = 'positionIds',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export const QUESTION_TEMPLATE_SORT_FIELDS = Object.values(QuestionTemplateSortField);