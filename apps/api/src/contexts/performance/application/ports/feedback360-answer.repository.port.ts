import { Feedback360AnswerDomain } from '../../domain/feedback360-answer.domain';
import { RespondentCategory } from '../../domain/enum/respondent-category.enum';

export const FEEDBACK360_ANSWER_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_ANSWER_REPOSITORY');

export type Feedback360AnswerSearchQuery = {
  feedback360Id?: number;
  respondentCategory?: RespondentCategory;
};

export interface Feedback360AnswerRepositoryPort {
  create(answer: Feedback360AnswerDomain): Promise<Feedback360AnswerDomain>;
  list(query: Feedback360AnswerSearchQuery): Promise<Feedback360AnswerDomain[]>;
  deleteById(id: number): Promise<void>;
}
