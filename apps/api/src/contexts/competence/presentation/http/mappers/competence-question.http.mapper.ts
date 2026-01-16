import { CompetenceQuestionDomain } from '../../../domain/competence-question.domain';
import { CompetenceQuestionResponse } from '../models/competence-question.response';

export class CompetenceQuestionHttpMapper {
  static toResponse(domain: CompetenceQuestionDomain): CompetenceQuestionResponse {
    const view = new CompetenceQuestionResponse();
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

