import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';

export type QuestionTemplateProps = {
  id?: number;
  title: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment?: boolean | null;
  status?: QuestionTemplateStatus;
  positionIds?: number[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class QuestionTemplateDomain {
  readonly id?: number;
  readonly title: string;
  readonly answerType: AnswerType;
  readonly competenceId: number;
  readonly isForSelfassessment: boolean;
  readonly status: QuestionTemplateStatus;
  readonly positionIds: number[];
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: QuestionTemplateProps) {
    this.id = props.id;
    this.title = props.title;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.status = props.status ?? QuestionTemplateStatus.ACTIVE;
    this.positionIds = props.positionIds ?? [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: QuestionTemplateProps): QuestionTemplateDomain {
    return new QuestionTemplateDomain(props);
  }

  withPositions(positionIds: number[]): QuestionTemplateDomain {
    return new QuestionTemplateDomain({ ...this, positionIds });
  }
}

