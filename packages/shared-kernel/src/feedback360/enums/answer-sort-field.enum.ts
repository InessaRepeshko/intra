export enum AnswerSortField {
    ID = 'id',
    REVIEW_ID = 'reviewId',
    QUESTION_ID = 'questionId',
    RESPONDENT_CATEGORY = 'respondentCategory',
    ANSWER_TYPE = 'answerType',
    NUMERICAL_VALUE = 'numericalValue',
    TEXT_VALUE = 'textValue',
    CREATED_AT = 'createdAt',
}

export const ANSWER_SORT_FIELDS = Object.values(AnswerSortField);