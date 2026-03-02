import { AnswerType } from '../../enums/answer-type.enum';
import { QuestionTemplateStatus } from '../../enums/question-template-status.enum';

export interface QuestionTemplateBaseDto<TDate = Date> {
    id: number;
    title: string;
    answerType: AnswerType;
    competenceId: number;
    isForSelfassessment: boolean;
    status: QuestionTemplateStatus;
    positionIds: number[];
    createdAt: TDate;
    updatedAt: TDate;
}

export type QuestionTemplateDto = QuestionTemplateBaseDto<Date>;

export type QuestionTemplateResponseDto = QuestionTemplateBaseDto<string>;
