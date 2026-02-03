import { AnswerType } from "../../enums/answer-type.enum";
import { QuestionTemplateStatus } from "../../enums/question-template-status.enum";

export type UpdateQuestionTemplatePayload = Partial<{
    competenceId: number;
    title: string;
    answerType: AnswerType;
    isForSelfassessment?: boolean;
    status?: QuestionTemplateStatus;
    positionIds?: number[];
}>;
