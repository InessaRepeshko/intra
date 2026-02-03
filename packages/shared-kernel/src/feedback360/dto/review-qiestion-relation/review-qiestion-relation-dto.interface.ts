import { AnswerType } from '../../../library/enums/answer-type.enum';

export interface ReviewQuestionRelationDto {
    id: number;
    reviewId: number;
    questionId: number;
    questionTitle: string;
    answerType: AnswerType;
    competenceId: number;
    competenceTitle: string;
    isForSelfassessment: boolean;
    createdAt: Date;
}
