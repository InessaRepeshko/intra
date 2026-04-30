export enum ReviewQuestionRelationSortField {
    ID = 'id',
    REVIEW_ID = 'reviewId',
    QUESTION_ID = 'questionId',
    QUESTION_TITLE = 'questionTitle',
    ANSWER_TYPE = 'answerType',
    COMPETENCE_ID = 'competenceId',
    COMPETENCE_TITLE = 'competenceTitle',
    COMPETENCE_CODE = 'competenceCode',
    COMPETENCE_DESCRIPTION = 'competenceDescription',
    IS_FOR_SELFASSESSMENT = 'isForSelfassessment',
    CREATED_AT = 'createdAt',
}

export const REVIEW_QUESTION_RELATION_SORT_FIELDS = Object.values(
    ReviewQuestionRelationSortField,
);
