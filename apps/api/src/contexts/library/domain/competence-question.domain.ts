import { CompetenceQuestionAnswerType } from './competence-question-answer-type.enum';
import { CompetenceQuestionStatus } from './competence-question-status.enum';

export type CompetenceQuestionProps = {
  id?: number;
  title: string;
  answerType: CompetenceQuestionAnswerType;
  competenceId: number;
  isForSelfassessment?: boolean | null;
  questionStatus?: CompetenceQuestionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  positionIds?: number[];
};

export class CompetenceQuestionDomain {
  readonly id?: number;
  readonly title: string;
  readonly answerType: CompetenceQuestionAnswerType;
  readonly competenceId: number;
  readonly isForSelfassessment: boolean;
  readonly questionStatus: CompetenceQuestionStatus;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly positionIds: number[];

  private constructor(props: CompetenceQuestionProps) {
    this.id = props.id;
    this.title = props.title;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.questionStatus = props.questionStatus ?? CompetenceQuestionStatus.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.positionIds = props.positionIds ?? [];
  }

  static create(props: CompetenceQuestionProps): CompetenceQuestionDomain {
    return new CompetenceQuestionDomain(props);
  }

  withPositions(positionIds: number[]): CompetenceQuestionDomain {
    return new CompetenceQuestionDomain({ ...this, positionIds });
  }
}

