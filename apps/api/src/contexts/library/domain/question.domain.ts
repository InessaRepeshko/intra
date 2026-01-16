import { AnswerType } from './answer-type.enum';
import { QuestionStatus } from './question-status.enum';

export type QuestionProps = {
  id?: number;
  title: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment?: boolean | null;
  questionStatus?: QuestionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  positionIds?: number[];
};

export class QuestionDomain {
  readonly id?: number;
  readonly title: string;
  readonly answerType: AnswerType;
  readonly competenceId: number;
  readonly isForSelfassessment: boolean;
  readonly questionStatus: QuestionStatus;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly positionIds: number[];

  private constructor(props: QuestionProps) {
    this.id = props.id;
    this.title = props.title;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.questionStatus = props.questionStatus ?? QuestionStatus.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.positionIds = props.positionIds ?? [];
  }

  static create(props: QuestionProps): QuestionDomain {
    return new QuestionDomain(props);
  }

  withPositions(positionIds: number[]): QuestionDomain {
    return new QuestionDomain({ ...this, positionIds });
  }
}

