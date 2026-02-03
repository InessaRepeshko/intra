import { AnswerType } from '../../../library/enums/answer-type.enum';

export type CreateQuestionPayload = {
    cycleId?: number | null;
    questionTemplateId?: number | null;
    title?: string;
    answerType?: AnswerType;
    competenceId?: number | null;
    isForSelfassessment?: boolean | null;
};
