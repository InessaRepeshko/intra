import { QuestionDomain } from '../../../domain/question.domain';
import { QuestionResponse } from '../models/question.response';

export class QuestionHttpMapper {
  static toResponse(domain: QuestionDomain): QuestionResponse {
    const view = new QuestionResponse();
    view.id = domain.id!;
    view.competenceId = domain.competenceId;
    view.title = domain.title;
    view.answerType = domain.answerType;
    view.isForSelfassessment = domain.isForSelfassessment;
    view.questionStatus = domain.questionStatus;
    view.positionIds = domain.positionIds;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }
}

