import { AnswerType } from '../../../library/enums/answer-type.enum';

export interface QuestionDto {
    id: number;
    cycleId?: number | null;
    questionTemplateId?: number | null;
    title: string;
    answerType: AnswerType;
    competenceId?: number | null;
    isForSelfassessment: boolean;
    createdAt: Date;
}
