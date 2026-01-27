import { QuestionTemplateDomain } from '../../../domain/question-template.domain';
import { QuestionTemplateResponse } from '../models/question-template.response';

export class QuestionTemplateHttpMapper {
  static toResponse(domain: QuestionTemplateDomain): QuestionTemplateResponse {
    const view = new QuestionTemplateResponse();
    view.id = domain.id!;
    view.competenceId = domain.competenceId;
    view.title = domain.title;
    view.answerType = domain.answerType;
    view.isForSelfassessment = domain.isForSelfassessment;
    view.status = domain.status;
    view.positionIds = domain.positionIds;
    view.createdAt = domain.createdAt!;
    view.updatedAt = domain.updatedAt!;
    return view;
  }
}

