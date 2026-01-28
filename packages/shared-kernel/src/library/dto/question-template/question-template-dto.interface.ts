import { QuestionTemplateStatus } from "../../enums/question-template-status.enum";
import { AnswerType } from "../../enums/answer-type.enum";

export interface QuestionTemplateDto {
    id: number;
    title: string;
    answerType: AnswerType;
    competenceId: number;
    isForSelfassessment: boolean;
    status: QuestionTemplateStatus;
    positionIds: number[];
    createdAt: Date;
    updatedAt: Date;
}