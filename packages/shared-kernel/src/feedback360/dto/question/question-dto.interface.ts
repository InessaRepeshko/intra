import { AnswerType } from '../../../library/enums/answer-type.enum';

export interface QuestionBaseDto<TDate = Date> {
    id: number;
    cycleId?: number | null;
    questionTemplateId?: number | null;
    title: string;
    answerType: AnswerType;
    competenceId?: number | null;
    isForSelfassessment: boolean;
    createdAt: TDate;
}

export type QuestionDto = QuestionBaseDto<Date>;

export type QuestionResponseDto = QuestionBaseDto<string>;
