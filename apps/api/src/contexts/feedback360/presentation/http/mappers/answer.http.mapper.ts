import { AnswerDomain } from '../../../domain/answer.domain';
import { AnswerResponse } from '../models/answer.response';

export class AnswerHttpMapper {
    static toResponse(domain: AnswerDomain): AnswerResponse {
        const view = new AnswerResponse();
        view.id = domain.id!;
        view.reviewId = domain.reviewId;
        view.questionId = domain.questionId;
        view.respondentCategory = domain.respondentCategory;
        view.answerType = domain.answerType;
        view.numericalValue = domain.numericalValue ?? null;
        view.textValue = domain.textValue ?? null;
        view.createdAt = domain.createdAt!;
        return view;
    }
}
