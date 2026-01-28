import { AnswerType } from "../../enums/answer-type.enum";
import { QuestionTemplateStatus } from "../../enums/question-template-status.enum";

export type CreateQuestionTemplatePayload = {
    competenceId: number;
    title: string;
    answerType: AnswerType;
    isForSelfassessment?: boolean;
    status?: QuestionTemplateStatus;
    positionIds?: number[];
};
