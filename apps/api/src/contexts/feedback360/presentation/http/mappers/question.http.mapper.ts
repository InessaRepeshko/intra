import { QuestionDomain } from '../../../domain/question.domain';
import { QuestionResponse } from '../models/question.response';

export class QuestionHttpMapper {
    static toResponse(domain: QuestionDomain): QuestionResponse {
        const view = new QuestionResponse();
        view.id = domain.id!;
        view.cycleId = domain.cycleId ?? null;
        view.questionTemplateId = domain.questionTemplateId ?? null;
        view.title = domain.title;
        view.answerType = domain.answerType;
        view.competenceId = domain.competenceId ?? null;
        view.isForSelfassessment = domain.isForSelfassessment;
        view.createdAt = domain.createdAt!;
        return view;
    }
}
