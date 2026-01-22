import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';

export type QuestionTemplateProps = {
  id?: number;
  title: string;
  answerType: AnswerType;
  competenceId: number;
  isForSelfassessment?: boolean | null;
  status?: QuestionTemplateStatus;
  createdAt?: Date;
  updatedAt?: Date;
  positionIds?: number[];
};

export class QuestionTemplateDomain {
  readonly id?: number;
  readonly title: string;
  readonly answerType: AnswerType;
  readonly competenceId: number;
  readonly isForSelfassessment: boolean;
  readonly status: QuestionTemplateStatus;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly positionIds: number[];

  private constructor(props: QuestionTemplateProps) {
    this.id = props.id;
    this.title = props.title;
    this.answerType = props.answerType;
    this.competenceId = props.competenceId;
    this.isForSelfassessment = props.isForSelfassessment ?? false;
    this.status = props.status ?? QuestionTemplateStatus.ACTIVE;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.positionIds = props.positionIds ?? [];
  }

  static create(props: QuestionTemplateProps): QuestionTemplateDomain {
    return new QuestionTemplateDomain(props);
  }

  withPositions(positionIds: number[]): QuestionTemplateDomain {
    return new QuestionTemplateDomain({ ...this, positionIds });
  }
}

